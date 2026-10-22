const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { createHash, randomBytes } = require("node:crypto");
const domain = require("./domain");
const { createOrderPlacer } = require("./customerOrders");
const { createOrderUpdater } = require("./adminOrders");
const { createReviewSubmitter } = require("./customerReviews");
const { orderNotification } = require("./orderNotifications");
const { normalizeProduct } = require("../lib/normalizeProduct");
initializeApp();
const db = getFirestore();
const options = { region: "us-central1", maxInstances: 5 };
function signedIn(request) {
  if (
    !request.auth ||
    request.auth.token.firebase?.sign_in_provider === "anonymous"
  )
    throw new HttpsError("unauthenticated", "Please sign in first.");
  return request.auth.uid;
}
function owner(request) {
  signedIn(request);
  if (!(
    request.auth.token.admin === true ||
    (request.auth.token.email_verified === true &&
      request.auth.token.email === "info@nourishspoon.com")
  ))
    throw new HttpsError(
      "permission-denied",
      "Verified owner access is required.",
    );
}
function callable(action) {
  return onCall(options, async (request) => {
    try {
      if (
        !request.data ||
        typeof request.data !== "object" ||
        Array.isArray(request.data)
      )
        throw new HttpsError("invalid-argument", "Send valid request details.");
      return await action(request);
    } catch (error) {
      if (error instanceof HttpsError) throw error;
      throw new HttpsError(
        "failed-precondition",
        error.message || "Please try again.",
      );
    }
  });
}
const loyalty = require("./rewards")({ db, callable, signedIn, owner });
const placeOrder = createOrderPlacer({ db, loyalty, normalizeProduct });
const updateOrder = createOrderUpdater({ db, loyalty, normalizeProduct });
const submitReview = createReviewSubmitter({ db });
for (const name of [
  "getRewards",
  "applyReferral",
  "quoteOrder",
  "saveRewardsSettings",
  "savePromoCode",
])
  exports[name] = loyalty[name];
exports.placeOrder = callable((request) =>
  placeOrder(request.data, {
    uid: signedIn(request),
    email: request.auth.token.email || "",
  }),
);
exports.updateOrder = callable((request) => {
  owner(request);
  return updateOrder(request.data, { uid: request.auth.uid });
});
exports.submitReview = callable((request) =>
  submitReview(request.data, {
    uid: signedIn(request),
  }),
);
exports.orderNotification = onDocumentUpdated(
  { ...options, document: "orders/{orderId}" },
  async (event) => {
    const after = event.data.after.data();
    const notice = orderNotification(
      event.data.before.data(),
      after,
      event.params.orderId,
    );
    if (!notice) return;
    // Event ID makes retried triggers idempotent.
    await db
      .doc(`users/${after.customer_uid}/notifications/${event.id}`)
      .set(notice);
  },
);
exports.issueNativeSession = callable(async (request) => {
  const uid = signedIn(request),
    challenge = domain.text(request.data.challenge, "challenge", 64);
  if (!/^[a-f0-9]{64}$/.test(challenge))
    throw new Error("Invalid sign-in challenge.");
  const code = randomBytes(32).toString("hex");
  await db
    .doc(`nativeSessions/${createHash("sha256").update(code).digest("hex")}`)
    .set({
      uid,
      challenge,
      expires: Timestamp.fromMillis(Date.now() + 120000),
    });
  return { code };
});
exports.redeemNativeSession = callable(async (request) => {
  const code = domain.text(request.data.code, "code", 64),
    verifier = domain.text(request.data.verifier, "verifier", 128);
  if (!/^[a-f0-9]{64}$/.test(code) || !/^[a-f0-9]{64}$/.test(verifier))
    throw new Error("Invalid sign-in session.");
  const ref = db.doc(
    `nativeSessions/${createHash("sha256").update(code).digest("hex")}`,
  );
  const uid = await db.runTransaction(async (tx) => {
    const session = await tx.get(ref),
      data = session.data();
    if (
      !data ||
      data.expires.toMillis() < Date.now() ||
      data.challenge !== createHash("sha256").update(verifier).digest("hex")
    )
      throw new HttpsError(
        "permission-denied",
        "This sign-in session has expired. Please try again.",
      );
    tx.delete(ref);
    return data.uid;
  });
  return { token: await getAuth().createCustomToken(uid) };
});
