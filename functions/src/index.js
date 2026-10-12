const { initializeApp } = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
} = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { createHash, randomBytes } = require("node:crypto");
const domain = require("./domain");
const { normalizeProduct } = require("../lib/normalizeProduct");
initializeApp();
const db = getFirestore();
const options = { region: "us-central1", maxInstances: 5 };
function signedIn(request) {
  if (!request.auth)
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
      if (!request.data || typeof request.data !== 'object' || Array.isArray(request.data))
        throw new HttpsError('invalid-argument', 'Send valid request details.');
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
exports.placeOrder = callable(async (request) => {
  const uid = signedIn(request),
    input = request.data;
  const shipping = domain.address(input.address || {});
  if (
    input.delivery_method === "sargodha_sameday" &&
    shipping.city.toLowerCase() !== "sargodha"
  )
    throw new Error("Choose nationwide delivery for this city.");
  if (
    !["bank_transfer", "easypaisa", "jazzcash"].includes(
      input.payment_method,
    )
  )
    throw new Error("Choose a payment method.");
  // A stable client request ID makes retries safe when the response is lost.
  const requestId = domain.text(input.request_id, "request ID", 80);
  if (!/^[A-Za-z0-9_-]{16,80}$/.test(requestId))
    throw new Error("Invalid request ID.");
  const orderRef = db
    .collection("orders")
    .doc(createHash("sha256").update(`${uid}:${requestId}`).digest("hex"));
  return db.runTransaction(async (tx) => {
    const previous = await tx.get(orderRef);
    if (previous.exists) return { id: previous.id, ...previous.data() };
    const [catalog, settingsDoc, customer] = await Promise.all([
      tx.get(db.collection("products")),
      tx.get(db.doc("settings/commerce")),
      tx.get(db.doc(`users/${uid}`)),
    ]);
    const products = catalog.docs.map((doc) =>
      normalizeProduct(doc.id, doc.data()),
    );
    const settings = settingsDoc.data() || {};
    const priced = domain.priceOrder(
      input.items,
      products,
      settings,
      input.delivery_method,
      !customer.data()?.has_order,
    );
    const order = {
      ...priced,
      customer_uid: uid,
      customer_name: shipping.name,
      customer_phone: shipping.phone,
      customer_email: request.auth.token.email || "",
      delivery_city: shipping.city,
      delivery_address: shipping.line,
      delivery_method_code: input.delivery_method,
      payment_method_code: input.payment_method,
      payment_status: "awaiting_payment",
      status: "pending",
      tracking_number: "",
      is_gift: input.is_gift === true,
      gift_message:
        typeof input.gift_message === "string"
          ? input.gift_message.trim().slice(0, 400)
          : "",
      order_number: `NS-${orderRef.id.slice(0, 10).toUpperCase()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    for (const product of products) {
      const matching = priced.items.filter(
        (item) => item.product_id === product.id,
      );
      if (!matching.length) continue;
      tx.update(db.doc(`products/${product.id}`), {
        variants: product.variants.map((v) => ({
          ...v,
          stock:
            v.stock == null
              ? null
              : v.stock -
                (matching.find((item) => item.variant_id === v.id)?.quantity ||
                  0),
        })),
        ...(product.legacy_stock != null
          ? {
              stock:
                product.legacy_stock -
                matching.reduce((sum, item) => sum + item.quantity, 0),
            }
          : {}),
      });
    }
    tx.set(orderRef, order);
    tx.set(db.doc(`users/${uid}`), { has_order: true }, { merge: true });
    return { id: orderRef.id, ...order };
  });
});
exports.updateOrder = callable(async (request) => {
  owner(request);
  const ref = db.doc(`orders/${domain.text(request.data.id, "order ID", 80)}`);
  return db.runTransaction(async (tx) => {
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new Error("Order not found.");
    const order = snapshot.data(),
      patch = { updated_at: new Date().toISOString() };
    if (request.data.status && request.data.status !== order.status) {
      domain.statusChange(order.status, request.data.status);
      patch.status = request.data.status;
    }
    if (request.data.payment_status) {
      if (
        !["awaiting_payment", "submitted", "paid", "refunded"].includes(
          request.data.payment_status,
        )
      )
        throw new Error("Invalid payment status.");
      patch.payment_status = request.data.payment_status;
    }
    if (request.data.delivery_fee !== undefined) {
      const fee = request.data.delivery_fee;
      if (!Number.isSafeInteger(fee) || fee < 0 || fee > 10000)
        throw new Error("Invalid delivery fee.");
      patch.delivery_fee = fee;
      patch.total = order.subtotal + fee - order.discount;
      patch.quote_pending = false;
    }
    if (request.data.tracking_number !== undefined) {
      const tracking = String(request.data.tracking_number).trim();
      if (tracking && !/^\d{8,20}$/.test(tracking))
        throw new Error("Enter a valid TCS consignment number.");
      patch.tracking_number = tracking;
    }
    if (
      patch.status === "confirmed" &&
      (patch.quote_pending ?? order.quote_pending)
    )
      throw new Error("Confirm the delivery fee before confirming the order.");
    if (
      patch.status === "out_for_delivery" &&
      order.delivery_method_code === "tcs_nationwide" &&
      !(patch.tracking_number || order.tracking_number)
    )
      throw new Error("Enter the TCS number before dispatch.");
    if (patch.status === "cancelled") {
      const productIds = [
        ...new Set(order.items.map((item) => item.product_id)),
      ];
      const products = await Promise.all(
        productIds.map((id) => tx.get(db.doc(`products/${id}`))),
      );
      products.forEach((doc) => {
        if (!doc.exists) return;
        const product = normalizeProduct(doc.id, doc.data());
        tx.update(doc.ref, {
          variants: product.variants.map((v) => ({
            ...v,
            stock:
              v.stock == null
                ? null
                : v.stock +
                  (order.items.find((item) => item.variant_id === v.id)
                    ?.quantity || 0),
          })),
          ...(product.legacy_stock != null
            ? {
                stock:
                  product.legacy_stock +
                  order.items
                    .filter((item) => item.product_id === product.id)
                    .reduce((sum, item) => sum + item.quantity, 0),
              }
            : {}),
        });
      });
    }
    tx.update(ref, patch);
    return { id: ref.id, ...order, ...patch };
  });
});
exports.submitReview = callable(async (request) => {
  const uid = signedIn(request),
    input = request.data;
  const order = await db
    .doc(`orders/${domain.text(input.order_id, "order ID", 80)}`)
    .get();
  if (
    !order.exists ||
    order.data().customer_uid !== uid ||
    order.data().status !== "delivered"
  )
    throw new HttpsError(
      "permission-denied",
      "Reviews are available after your order is delivered.",
    );
  const item = order
    .data()
    .items.find((item) => item.product_id === input.product_id);
  if (
    !item ||
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  )
    throw new Error("Choose a product and rating.");
  const comment = domain.text(input.comment, "review", 1000);
  const ref = db.collection("reviews").doc(`${order.id}_${item.product_id}`);
  await ref.create({
    customer_uid: uid,
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product_name,
    customer_name: order.data().customer_name,
    location: order.data().delivery_city,
    rating: input.rating,
    comment,
    status: "pending",
    verified: true,
    helpful_count: 0,
    is_featured: false,
    review_date: new Date().toISOString(),
  });
  return { id: ref.id };
});
exports.orderNotification = onDocumentUpdated(
  { ...options, document: "orders/{orderId}" },
  async (event) => {
    const before = event.data.before.data(),
      after = event.data.after.data();
    if (
      before.status === after.status &&
      before.payment_status === after.payment_status &&
      before.tracking_number === after.tracking_number &&
      before.total === after.total
    )
      return;
    const notice = {
      order_id: event.params.orderId,
      title: `${after.order_number} updated`,
      body: `Order: ${after.status.replaceAll("_", " ")}. Payment: ${after.payment_status.replaceAll("_", " ")}.`,
      created_at: new Date().toISOString(),
      read: false,
    };
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
