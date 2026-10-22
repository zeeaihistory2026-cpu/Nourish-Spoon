import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth as clientAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore as clientDatabase,
  connectFirestoreEmulator,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
const require = createRequire(import.meta.url);
const { seed } = require("./seed-emulator.cjs");
const functionsRequire = createRequire(
  new URL("../functions/package.json", import.meta.url),
);
const { getFirestore } = functionsRequire("firebase-admin/firestore");
const { getAuth } = functionsRequire("firebase-admin/auth");
const origin = process.env.NOURISH_QA_ORIGIN || "http://localhost:3000";
let customerToken, ownerCookie, server;
async function request(path, data, headers = {}, method = "POST") {
  const response = await fetch(origin + path, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  return {
    status: response.status,
    body: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
before(async () => {
  const health = await request("/api/health", undefined, {}, "GET");
  assert.equal(
    health.body.projectId,
    "demo-nourish-spoon",
    "Refusing to test any production database",
  );
  server = await seed();
  async function login(email) {
    const response = await fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "NourishQA!2026",
          returnSecureToken: true,
        }),
      },
    );
    const account = await response.json();
    assert.ok(account.idToken);
    return account.idToken;
  }
  customerToken = await login("customer@example.invalid");
  const ownerToken = await login("info@nourishspoon.com");
  const session = await request(
    "/api/auth/session",
    { idToken: ownerToken },
    { Origin: origin },
  );
  assert.equal(session.status, 200);
  ownerCookie = session.cookie;
});
after(async () => {
  await server?.delete();
});
const checkout = () => ({
  request_id: randomUUID(),
  items: [
    {
      product_id: "date-and-nuts-energy-balls",
      variant_id: "date-and-nuts-energy-balls:250g",
      quantity: 2,
      unit_price: 1,
    },
  ],
  delivery_method: "self_pickup",
  payment_method: "bank_transfer",
  address: {
    name: "QA Customer",
    phone: "03001234567",
    city: "Sargodha",
    line: "Isolated QA fixture",
  },
});
const owner = () => ({ Cookie: ownerCookie, Origin: origin });
const customer = () => ({ Authorization: `Bearer ${customerToken}` });
test("customer API rejects unsigned, cross-origin and privileged actions", async () => {
  assert.equal((await request("/api/shop/quoteOrder", checkout())).status, 401);
  assert.equal(
    (
      await request("/api/shop/quoteOrder", checkout(), {
        Origin: "https://untrusted.invalid",
        ...customer(),
      })
    ).status,
    403,
  );
  assert.equal(
    (await request("/api/shop/updateOrder", {}, customer())).status,
    404,
  );
  assert.equal(
    (await request("/api/admin/offers", {}, customer())).status,
    403,
  );
});
test("dashboard offers are applied by shared checkout and retries reserve stock once", async () => {
  const code = "QA" + Date.now();
  const created = await request(
    "/api/admin/offers",
    {
      code,
      description: "Isolated API test",
      discountType: "percent",
      value: 15,
      isActive: true,
    },
    owner(),
  );
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const input = {
    ...checkout(),
    promo_code: code.toLowerCase(),
    discount: 999999,
  };
  const quote = await request("/api/shop/quoteOrder", input, customer());
  assert.equal(quote.status, 200, JSON.stringify(quote.body));
  assert.equal(quote.body.data.subtotal, 4398);
  assert.equal(quote.body.data.promo_discount, 659);
  assert.equal(quote.body.data.total, 3739);
  const pausedOffer = await request(
    `/api/admin/offers/${code}`,
    { isActive: false },
    owner(),
    "PATCH",
  );
  assert.equal(pausedOffer.status, 200, JSON.stringify(pausedOffer.body));
  assert.equal(pausedOffer.body.item.description, "Isolated API test");
  assert.equal(pausedOffer.body.item.value, 15);
  assert.equal(
    (await request("/api/shop/quoteOrder", input, customer())).status,
    400,
  );
  assert.equal(
    (
      await request(
        `/api/admin/offers/${code}`,
        { isActive: true },
        owner(),
        "PATCH",
      )
    ).status,
    200,
  );
  const placed = await request("/api/shop/placeOrder", input, customer());
  assert.equal(placed.status, 200, JSON.stringify(placed.body));
  assert.equal(placed.body.data.total, 3739);
  const retry = await request("/api/shop/placeOrder", input, customer());
  assert.equal(retry.body.data.id, placed.body.data.id);
  const orderId = placed.body.data.id;
  const listed = await request(
    "/api/admin/orders?status=pending",
    undefined,
    owner(),
    "GET",
  );
  assert.ok(
    listed.body.items.some((order) => order.id === orderId),
    "A customer order must appear in the dashboard list",
  );
  const loaded = await request(
    `/api/admin/orders/${orderId}`,
    undefined,
    owner(),
    "GET",
  );
  assert.equal(loaded.body.item.orderStatus, "pending");
  assert.equal(loaded.body.item.total, 3739);
  for (const orderStatus of [
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ]) {
    const changed = await request(
      `/api/admin/orders/${orderId}`,
      { orderStatus, paymentStatus: "paid" },
      owner(),
      "PATCH",
    );
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
  }
  const review = await request(
    "/api/shop/submitReview",
    {
      order_id: orderId,
      product_id: input.items[0].product_id,
      rating: 5,
      comment: "Isolated delivered-order review",
    },
    customer(),
  );
  assert.equal(review.status, 200, JSON.stringify(review.body));
  await request(`/api/admin/offers/${code}`, undefined, owner(), "DELETE");
  const paused = await request(
    "/api/shop/quoteOrder",
    { ...checkout(), promo_code: code },
    customer(),
  );
  assert.equal(paused.status, 400);
  assert.match(paused.body.error, /unavailable/);
});

test("dashboard-created 10% code recalculates shipping and old pending orders can be confirmed", async () => {
  const db = getFirestore(server);
  const id = "qa-shipping-boundary";
  await db.doc(`products/${id}`).set({
    name: "QA shipping boundary",
    active: true,
    variants: [
      {
        id: `${id}:pack`,
        weight: "Pack",
        active: true,
        regular_price: 2690,
        sale_price: null,
        stock: null,
      },
    ],
  });
  const code = "TEN" + Date.now();
  assert.equal(
    (
      await request(
        "/api/admin/offers",
        { code, discountType: "percent", value: 10, isActive: true },
        owner(),
      )
    ).status,
    201,
  );
  const input = {
    ...checkout(),
    delivery_method: "tcs_nationwide",
    items: [{ product_id: id, variant_id: `${id}:pack`, quantity: 1 }],
  };
  const regular = await request("/api/shop/quoteOrder", input, customer());
  assert.equal(regular.body.data.discount, 0);
  assert.equal(regular.body.data.delivery_fee, 0);
  const quote = await request(
    "/api/shop/quoteOrder",
    { ...input, promo_code: code.toLowerCase() },
    customer(),
  );
  assert.equal(quote.body.data.promo_discount, 269);
  assert.equal(quote.body.data.delivery_fee, 250);
  assert.equal(quote.body.data.total, 2671);
  const placed = await request(
    "/api/shop/placeOrder",
    { ...input, promo_code: code },
    customer(),
  );
  assert.equal(placed.body.data.total, 2671);
  const ref = db.doc(`orders/${placed.body.data.id}`);
  await ref.update({
    quote_pending: true,
    delivery_fee: null,
    total: null,
    last_notice_id: "qa-import-" + randomUUID(),
  });
  const confirmed = await request(
    `/api/admin/orders/${ref.id}`,
    { orderStatus: "confirmed" },
    owner(),
    "PATCH",
  );
  assert.equal(confirmed.status, 200, JSON.stringify(confirmed.body));
  assert.equal(confirmed.body.item.orderStatus, "confirmed");
  assert.equal(confirmed.body.item.deliveryFee, 250);
  assert.equal(confirmed.body.item.total, 2671);
  assert.equal(confirmed.body.item.quotePending, false);
  const notices = await db
    .collection(`users/qa-customer/notifications`)
    .where("order_id", "==", ref.id)
    .get();
  assert.equal(
    notices.size,
    2,
    "One receipt and one confirmation notice are saved",
  );
  await request(
    `/api/admin/orders/${ref.id}`,
    { orderStatus: "confirmed", paymentStatus: "awaiting_payment" },
    owner(),
    "PATCH",
  );
  assert.equal(
    (
      await db
        .collection(`users/qa-customer/notifications`)
        .where("order_id", "==", ref.id)
        .get()
    ).size,
    2,
    "Retrying an unchanged update cannot send duplicate notices",
  );
});

test("signed-in app listeners receive order confirmation and its notification live", async () => {
  const app = initializeApp(
    {
      apiKey: "demo-key",
      projectId: "demo-nourish-spoon",
      appId: "qa-live-listener",
    },
    "qa-live-" + randomUUID(),
  );
  const auth = clientAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  const db = clientDatabase(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  const stops = [];
  try {
    await signInWithEmailAndPassword(
      auth,
      "customer@example.invalid",
      "NourishQA!2026",
    );
    const placed = await request(
      "/api/shop/placeOrder",
      checkout(),
      customer(),
    );
    assert.equal(placed.status, 200);
    const id = placed.body.data.id;
    function observe(reference, matches) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(
          () => reject(Error("Live Firestore update timed out")),
          20000,
        );
        const stop = onSnapshot(
          reference,
          (snapshot) => {
            if (snapshot.exists() && matches(snapshot.data())) {
              clearTimeout(timeout);
              resolve(snapshot.data());
            }
          },
          (error) => {
            clearTimeout(timeout);
            reject(error);
          },
        );
        stops.push(stop);
      });
    }
    const statusChanged = observe(
      doc(db, "orders", id),
      (order) => order.status === "confirmed",
    );
    const changed = await request(
      `/api/admin/orders/${id}`,
      { orderStatus: "confirmed" },
      owner(),
      "PATCH",
    );
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
    const canonical = (
      await getFirestore(server).doc(`orders/${id}`).get()
    ).data();
    const notificationChanged = observe(
      doc(
        db,
        "users",
        "qa-customer",
        "notifications",
        canonical.last_notice_id,
      ),
      (notice) => notice.order_id === id,
    );
    const [order, notice] = await Promise.all([
      statusChanged,
      notificationChanged,
    ]);
    assert.equal(order.customer_uid, "qa-customer");
    assert.match(notice.body, /confirmed/);
  } finally {
    stops.forEach((stop) => stop());
    await deleteApp(app);
  }
});

test("app reviews reach moderation and approved reviews appear live with five-star ratings", async () => {
  const app = initializeApp(
    {
      apiKey: "demo-key",
      projectId: "demo-nourish-spoon",
      appId: "qa-reviews",
    },
    "qa-reviews-" + randomUUID(),
  );
  const auth = clientAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  const db = clientDatabase(app);
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  let stop = () => {};
  let timer;
  try {
    await signInWithEmailAndPassword(
      auth,
      "customer@example.invalid",
      "NourishQA!2026",
    );
    const placed = await request(
      "/api/shop/placeOrder",
      checkout(),
      customer(),
    );
    assert.equal(placed.status, 200);
    const orderId = placed.body.data.id;
    const input = {
      order_id: orderId,
      product_id: checkout().items[0].product_id,
      rating: 5,
      comment: "QA verified purchase review",
    };
    const sharp = functionsRequire("sharp");
    const photoBytes = await sharp({
      create: { width: 20, height: 16, channels: 3, background: "#003e31" },
    })
      .jpeg()
      .toBuffer();
    input.photo = "data:image/jpeg;base64," + photoBytes.toString("base64");
    assert.equal(
      (await request("/api/shop/saveProfilePhoto", { photo: input.photo }))
        .status,
      401,
    );
    assert.equal(
      (
        await request(
          "/api/shop/saveProfilePhoto",
          { photo: "data:image/svg+xml;base64,PHN2Zz4=" },
          customer(),
        )
      ).status,
      400,
    );
    assert.equal(
      (
        await request(
          "/api/shop/saveProfilePhoto",
          { uid: "other-customer", photo: input.photo },
          customer(),
        )
      ).status,
      200,
    );
    assert.ok(
      (await getDoc(doc(db, "users", "qa-customer", "media", "profile"))).data()
        .data,
    );
    assert.equal(
      (await request("/api/shop/submitReview", input, customer())).status,
      400,
    );
    assert.equal(
      (
        await request(
          `/api/admin/orders/${orderId}`,
          { orderStatus: "delivered" },
          owner(),
          "PATCH",
        )
      ).status,
      200,
    );
    const submitted = await request(
      "/api/shop/submitReview",
      input,
      customer(),
    );
    assert.equal(submitted.status, 200, JSON.stringify(submitted.body));
    const id = submitted.body.data.id;
    const pending = await request(
      "/api/admin/reviews?visibility=pending",
      undefined,
      owner(),
      "GET",
    );
    const review = pending.body.items.find((item) => item.id === id);
    assert.equal(review.rating, 5);
    assert.equal(review.visibility, "pending");
    assert.equal(review.verifiedPurchase, true);
    assert.ok(review.photoUrl);
    assert.ok(
      (await getDoc(doc(db, "reviews", id, "media", "photo"))).data().data,
    );
    const imageResponse = await fetch(origin + review.photoUrl, {
      headers: owner(),
    });
    assert.equal(imageResponse.status, 200);
    assert.equal(imageResponse.headers.get("content-type"), "image/jpeg");
    assert.equal((await fetch(origin + review.photoUrl)).status, 401);
    assert.equal(
      (
        await request(
          `/api/admin/reviews/${id}`,
          { visibility: "visible" },
          customer(),
          "PATCH",
        )
      ).status,
      403,
    );
    const duplicate = await request(
      "/api/shop/submitReview",
      input,
      customer(),
    );
    assert.equal(duplicate.status, 400);
    assert.match(duplicate.body.error, /already submitted/i);
    const publicReviews = query(
      collection(db, "reviews"),
      where("status", "==", "approved"),
    );
    assert.ok(
      !(await getDocs(publicReviews)).docs.some((doc) => doc.id === id),
    );
    const approvedLive = new Promise((resolve, reject) => {
      timer = setTimeout(
        () => reject(Error("Approved review did not reach the app listener")),
        20000,
      );
      stop = onSnapshot(
        publicReviews,
        (snapshot) => {
          const review = snapshot.docs.find((doc) => doc.id === id);
          if (review) resolve(review.data());
        },
        reject,
      );
    });
    const approved = await request(
      `/api/admin/reviews/${id}`,
      { visibility: "visible" },
      owner(),
      "PATCH",
    );
    assert.equal(approved.status, 200, JSON.stringify(approved.body));
    assert.equal((await approvedLive).rating, 5);
    clearTimeout(timer);
    stop();
    assert.ok(approved.body.item.moderatedAt);
    assert.equal(approved.body.item.comment, input.comment);
    const mine = await getDocs(
      query(
        collection(db, "reviews"),
        where("customer_uid", "==", "qa-customer"),
      ),
    );
    assert.equal(
      mine.docs.find((doc) => doc.id === id).data().status,
      "approved",
    );
    assert.equal(
      (
        await request(
          `/api/admin/reviews/${id}`,
          { visibility: "hidden" },
          owner(),
          "PATCH",
        )
      ).status,
      200,
    );
    assert.ok(
      !(await getDocs(publicReviews)).docs.some((doc) => doc.id === id),
    );
    assert.equal(
      (
        await request(
          `/api/admin/reviews/${id}`,
          { visibility: "removed" },
          owner(),
          "PATCH",
        )
      ).status,
      200,
    );
    const removed = await request(
      "/api/admin/reviews?visibility=removed",
      undefined,
      owner(),
      "GET",
    );
    assert.ok(removed.body.items.some((item) => item.id === id));
    assert.equal(
      (await request("/api/shop/saveProfilePhoto", { photo: null }, customer()))
        .status,
      200,
    );
    assert.equal(
      (
        await getDoc(doc(db, "users", "qa-customer", "media", "profile"))
      ).exists(),
      false,
    );
  } finally {
    clearTimeout(timer);
    stop();
    await deleteApp(app);
  }
});

test("dashboard referral settings, customer codes, settlement and refund share one ledger", async () => {
  const auth = getAuth(server);
  async function account(prefix) {
    const uid = prefix + Date.now();
    const email = `${uid}@example.invalid`;
    await auth.createUser({
      uid,
      email,
      emailVerified: true,
      password: "NourishQA!2026",
    });
    const response = await fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "NourishQA!2026",
          returnSecureToken: true,
        }),
      },
    );
    return {
      uid,
      headers: { Authorization: `Bearer ${(await response.json()).idToken}` },
    };
  }
  const referrer = await account("referrer"),
    friend = await account("friend");
  const config = await request(
    "/api/admin/referrals/config",
    { referrerReward: 200, isActive: true },
    owner(),
    "PUT",
  );
  assert.equal(config.status, 200, JSON.stringify(config.body));
  const wallet = await request("/api/shop/getRewards", {}, referrer.headers);
  assert.equal(wallet.body.data.config.referral_points, 200);
  await request("/api/shop/getRewards", {}, friend.headers);
  assert.equal(
    (
      await request(
        "/api/shop/applyReferral",
        { code: wallet.body.data.referral_code },
        referrer.headers,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/api/shop/applyReferral",
        { code: wallet.body.data.referral_code.toLowerCase() },
        friend.headers,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        "/api/shop/applyReferral",
        { code: wallet.body.data.referral_code },
        friend.headers,
      )
    ).status,
    400,
  );
  const placed = await request(
    "/api/shop/placeOrder",
    checkout(),
    friend.headers,
  );
  assert.equal(placed.status, 200, JSON.stringify(placed.body));
  for (const orderStatus of [
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ]) {
    const changed = await request(
      `/api/admin/orders/${placed.body.data.id}`,
      { orderStatus, paymentStatus: "paid" },
      owner(),
      "PATCH",
    );
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
  }
  const balance = async () =>
    (await request("/api/shop/getRewards", {}, referrer.headers)).body.data
      .balance;
  assert.equal(await balance(), 200);
  await request(
    `/api/admin/orders/${placed.body.data.id}`,
    { orderStatus: "delivered", paymentStatus: "paid" },
    owner(),
    "PATCH",
  );
  assert.equal(await balance(), 200);
  const referrals = await request(
    "/api/admin/referrals",
    undefined,
    owner(),
    "GET",
  );
  assert.equal(
    referrals.body.items.find((item) => item.referredId === friend.uid)?.status,
    "rewarded",
  );
  await request(
    `/api/admin/orders/${placed.body.data.id}`,
    { paymentStatus: "refunded" },
    owner(),
    "PATCH",
  );
  assert.equal(await balance(), 0);
  const paused = await request(
    "/api/admin/referrals/config",
    { referrerReward: 200, isActive: false },
    owner(),
    "PUT",
  );
  assert.equal(paused.status, 200);
  const newcomer = await account("paused");
  assert.equal(
    (
      await request(
        "/api/shop/applyReferral",
        { code: wallet.body.data.referral_code },
        newcomer.headers,
      )
    ).status,
    400,
  );
  await request(
    "/api/admin/referrals/config",
    { referrerReward: 200, isActive: true },
    owner(),
    "PUT",
  );
});
test("editing an untracked product preserves availability and ingredient images", async () => {
  const id = "date-and-nuts-energy-balls";
  const previous = await request(
    `/api/admin/products/${id}`,
    undefined,
    owner(),
    "GET",
  );
  assert.equal(previous.body.item.stock, null);
  const { name, description, ingredients } = previous.body.item;
  const updated = await request(
    `/api/admin/products/${id}`,
    {
      name,
      description,
      stock: null,
      ingredients: ingredients.map((item) => ({ name: item.name })),
    },
    owner(),
    "PATCH",
  );
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  assert.equal(updated.body.item.stock, null);
  assert.deepEqual(updated.body.item.ingredients, ingredients);
});
test("unknown codes, expired codes and unmet minimum spend are rejected", async () => {
  const unknown = await request(
    "/api/shop/quoteOrder",
    { ...checkout(), promo_code: "DOES_NOT_EXIST" },
    customer(),
  );
  assert.equal(unknown.status, 400);
  const code = "MIN" + Date.now();
  const created = await request(
    "/api/admin/offers",
    {
      code,
      discountType: "fixed",
      value: 100,
      minSubtotal: 5000,
      isActive: true,
    },
    owner(),
  );
  assert.equal(created.status, 201);
  const minimum = await request(
    "/api/shop/quoteOrder",
    { ...checkout(), promo_code: code },
    customer(),
  );
  assert.equal(minimum.status, 400);
  await request(
    `/api/admin/offers/${code}`,
    { minSubtotal: 0, expiresAt: "2020-01-01" },
    owner(),
    "PATCH",
  );
  const expired = await request(
    "/api/shop/quoteOrder",
    { ...checkout(), promo_code: code },
    customer(),
  );
  assert.equal(expired.status, 400);
});

test("device registration requires login and transfers an installation to its current account", async () => {
  const installationId = randomUUID();
  const payload = {
    installationId,
    token: "qa-native-device-token-without-real-fcm",
    platform: "android",
  };
  assert.equal(
    (await request("/api/shop/registerDevice", payload)).status,
    401,
  );
  assert.equal(
    (await request("/api/shop/registerDevice", payload, customer())).status,
    200,
  );
  const ref = getFirestore(server).doc(`pushDevices/${installationId}`);
  assert.equal((await ref.get()).data().uid, "qa-customer");
  const ownerToken = await fetch(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "info@nourishspoon.com",
        password: "NourishQA!2026",
        returnSecureToken: true,
      }),
    },
  ).then((r) => r.json());
  const headers = { Authorization: `Bearer ${ownerToken.idToken}` };
  assert.equal(
    (await request("/api/shop/registerDevice", payload, headers)).status,
    200,
  );
  assert.equal((await ref.get()).data().uid, "qa-owner");
  await request("/api/shop/unregisterDevice", { installationId }, customer());
  assert.equal(
    (await ref.get()).exists,
    true,
    "previous owner cannot unregister a switched account",
  );
  await request("/api/shop/unregisterDevice", { installationId }, headers);
  assert.equal((await ref.get()).exists, false);
});

test("dashboard broadcasts reach every customer's live inbox even without a push token", async () => {
  const created = await request(
    "/api/admin/notifications",
    {
      title: "QA announcement",
      body: "Your fresh batch is ready.",
      audience: "all",
    },
    owner(),
  );
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const id = created.body.item.id;
  const sent = await request(
    `/api/admin/notifications/${id}/send`,
    {},
    owner(),
  );
  assert.equal(sent.status, 200, JSON.stringify(sent.body));
  assert.ok(sent.body.reached >= 2);
  assert.equal(sent.body.pushed, 0, "QA must never contact production FCM");
  const notice = await getFirestore(server)
    .doc(`users/qa-customer/notifications/broadcast-${id}`)
    .get();
  assert.equal(notice.data().title, "QA announcement");
  assert.equal(notice.data().read, false);
  assert.ok(notice.data().created_at);
  assert.equal(
    (await request(`/api/admin/notifications/${id}/send`, {}, owner())).status,
    409,
  );
  const customers = await request(
    "/api/admin/customers",
    undefined,
    owner(),
    "GET",
  );
  assert.equal(customers.status, 200);
  assert.ok(customers.body.items.some((item) => item.id === "qa-customer"));
});

test("fulfilment needs no tracking ID and tracking can be added after delivery", async () => {
  const placed = await request(
    "/api/shop/placeOrder",
    { ...checkout(), delivery_method: "tcs_nationwide" },
    customer(),
  );
  assert.equal(placed.status, 200, JSON.stringify(placed.body));
  const id = placed.body.data.id;
  const db = getFirestore(server);
  const before = (await db.doc(`orders/${id}`).get()).data();
  const invalid = await request(
    "/api/admin/tracking",
    { orderId: before.order_number, trackingNumber: "wrong" },
    owner(),
  );
  assert.equal(invalid.status, 400);
  assert.equal(
    (
      await request(
        "/api/admin/tracking",
        { orderId: "missing", trackingNumber: "12345678901" },
        owner(),
      )
    ).status,
    404,
  );
  const dispatched = await request(
    `/api/admin/orders/${id}`,
    { orderStatus: "out_for_delivery" },
    owner(),
    "PATCH",
  );
  assert.equal(dispatched.status, 200, JSON.stringify(dispatched.body));
  assert.equal(dispatched.body.item.orderStatus, "out_for_delivery");
  assert.ok(!dispatched.body.item.trackingNumber);
  const delivered = await request(
    `/api/admin/tracking/${id}`,
    { milestone: { key: "delivered" } },
    owner(),
    "PATCH",
  );
  assert.equal(delivered.status, 200, JSON.stringify(delivered.body));
  assert.equal(delivered.body.item.current, "delivered");
  assert.ok(!delivered.body.item.trackingNumber);
  const deliveredHistory = (await db.doc(`orders/${id}`).get()).data()
    .status_history;
  const created = await request(
    "/api/admin/tracking",
    {
      orderId: before.order_number.toLowerCase(),
      trackingNumber: "12345678901",
    },
    owner(),
  );
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.item.id, id);
  assert.equal(created.body.item.trackingNumber, "12345678901");
  assert.equal(created.body.item.current, "delivered");
  const listed = await request(
    "/api/admin/tracking?search=12345678901",
    undefined,
    owner(),
    "GET",
  );
  assert.ok(listed.body.items.some((item) => item.id === id));
  const canonical = (await db.doc(`orders/${id}`).get()).data();
  assert.equal(canonical.status, "delivered");
  assert.equal(canonical.tracking_number, "12345678901");
  assert.deepEqual(canonical.status_history, deliveredHistory);
  const detail = await request(
    `/api/admin/orders/${id}`,
    undefined,
    owner(),
    "GET",
  );
  assert.equal(detail.body.item.orderStatus, "delivered");
  assert.equal(
    (
      await request(
        `/api/admin/orders/${id}`,
        { orderStatus: "confirmed" },
        owner(),
        "PATCH",
      )
    ).status,
    400,
  );
  const historyLength = canonical.status_history.length;
  assert.equal(
    (
      await request(
        `/api/admin/orders/${id}`,
        { orderStatus: "delivered", paymentStatus: "paid" },
        owner(),
        "PATCH",
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await request(
        `/api/admin/orders/${id}`,
        { orderStatus: "delivered", paymentStatus: "paid" },
        owner(),
        "PATCH",
      )
    ).status,
    200,
  );
  assert.equal(
    (await db.doc(`orders/${id}`).get()).data().status_history.length,
    historyLength,
  );
});

test("admin order inbox receives new customer orders and persists read state safely", async () => {
  const placed = await request("/api/shop/placeOrder", checkout(), customer());
  const id = placed.body.data.id;
  const inbox = () =>
    request("/api/admin/order-notifications", undefined, owner(), "GET");
  const received = await inbox();
  assert.equal(received.status, 200, JSON.stringify(received.body));
  assert.ok(received.body.unreadCount > 0);
  assert.equal(
    received.body.items.find((notice) => notice.id === id).unread,
    true,
  );
  const through = received.body.items[0].createdAt;
  assert.equal(
    (
      await request(
        "/api/admin/order-notifications",
        { through },
        { ...owner(), Origin: "https://untrusted.invalid" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/api/admin/order-notifications",
        { through: "invalid" },
        owner(),
      )
    ).status,
    400,
  );
  assert.equal(
    (await request("/api/admin/order-notifications", { through }, owner()))
      .status,
    200,
  );
  assert.equal((await inbox()).body.unreadCount, 0);
  await request(
    "/api/admin/order-notifications",
    { through: "1970-01-01T00:00:00.000Z" },
    owner(),
  );
  assert.equal(
    (await inbox()).body.unreadCount,
    0,
    "An older tab cannot undo a newer read cursor",
  );
  const newer = await request("/api/shop/placeOrder", checkout(), customer());
  const refreshed = await inbox();
  assert.ok(
    refreshed.body.items.some(
      (notice) => notice.id === newer.body.data.id && notice.unread,
    ),
  );
  assert.ok(refreshed.body.unreadCount >= 1);
});

test("dashboard delegates require verified accounts and cannot escalate their own role", async () => {
  const auth = getAuth(server),
    stamp = Date.now();
  async function account(verified, role) {
    const email = `qa-access-${stamp}-${role}-${verified}@example.invalid`;
    const created = await auth.createUser({
      email,
      emailVerified: verified,
      password: "NourishQA!2026",
    });
    // Older dashboard versions incorrectly granted every delegate this claim.
    await auth.setCustomUserClaims(created.uid, { admin: true });
    assert.equal(
      (
        await request(
          "/api/admin/access",
          { email, name: "QA delegate", role },
          owner(),
        )
      ).status,
      200,
    );
    const login = await fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: "NourishQA!2026",
          returnSecureToken: true,
        }),
      },
    ).then((res) => res.json());
    return {
      email,
      session: await request(
        "/api/auth/session",
        { idToken: login.idToken },
        { Origin: origin },
      ),
    };
  }
  const unverified = await account(false, "child");
  assert.equal(unverified.session.status, 403);
  const delegate = await account(true, "child");
  assert.equal(delegate.session.status, 200);
  const childHeaders = { Cookie: delegate.session.cookie, Origin: origin };
  assert.equal(
    (await request("/api/admin/orders", undefined, childHeaders, "GET")).status,
    200,
  );
  assert.equal(
    (await request("/api/admin/access", undefined, childHeaders, "GET")).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/api/admin/access",
        { email: delegate.email, name: "Escalation", role: "admin" },
        childHeaders,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        "/api/admin/access",
        { email: delegate.email, name: "Invalid", role: "owner" },
        owner(),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await request(
        "/api/admin/access",
        { email: delegate.email, name: "Cross origin", role: "admin" },
        { ...owner(), Origin: "https://untrusted.invalid" },
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await request(
        `/api/admin/access?email=${encodeURIComponent(delegate.email)}`,
        undefined,
        owner(),
        "DELETE",
      )
    ).status,
    200,
  );
  assert.equal(
    (await request("/api/admin/orders", undefined, childHeaders, "GET")).status,
    403,
    "Removing access revokes an existing session",
  );
});

test("weekly and monthly graphs reconcile paid receipts regardless of fulfilment", async () => {
  const placed = await request("/api/shop/placeOrder", checkout(), customer());
  const db = getFirestore(server);
  const template = (await db.doc(`orders/${placed.body.data.id}`).get()).data();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (key) => Number(today.find((value) => value.type === key).value);
  const year = part("year"),
    month = part("month") - 1,
    day = part("day");
  const dayStart = Date.UTC(year, month, day) - 5 * 3600000;
  const monthStart = Date.UTC(year, month, 1) - 5 * 3600000;
  const ids = ["qa-sales-month", "qa-sales-prior", "qa-sales-future"];
  try {
    for (const [index, at] of [
      monthStart,
      monthStart - 86400000,
      dayStart + 2 * 86400000,
    ].entries()) {
      await db.doc(`orders/${ids[index]}`).set({
        ...template,
        total: 700 + index,
        status: "delivered",
        payment_status: "paid",
        created_at: new Date(at).toISOString(),
        updated_at: new Date(at).toISOString(),
      });
    }
    const report = await request(
      "/api/admin/dashboard",
      undefined,
      owner(),
      "GET",
    );
    assert.equal(report.status, 200, JSON.stringify(report.body));
    const all = (await db.collection("orders").get()).docs.map((doc) =>
      doc.data(),
    );
    const range = (from) =>
      all.filter(
        (order) =>
          Date.parse(order.paid_at || order.created_at) >= from &&
          Date.parse(order.paid_at || order.created_at) <= Date.now(),
      );
    const revenue = (orders) =>
      orders
        .filter(
          (order) =>
            order.payment_status === "paid" && !order.quote_pending && Number.isSafeInteger(order.total),
        )
        .reduce((sum, order) => sum + order.total, 0);
    assert.equal(report.body.sales.weekly.points.length, 7);
    assert.equal(report.body.sales.monthly.points.length, day);
    assert.equal(
      report.body.sales.weekly.total,
      revenue(range(dayStart - 6 * 86400000)),
    );
    assert.equal(report.body.sales.monthly.total, revenue(range(monthStart)));
    assert.equal(report.body.sales.monthly.orders, range(monthStart).filter(order => order.payment_status === "paid").length);
    assert.equal(
      report.body.sales.monthly.total,
      report.body.sales.monthly.points.reduce(
        (sum, point) => sum + point.revenue,
        0,
      ),
    );
    assert.ok(
      report.body.recentOrders.some(
        (order) => order.id === placed.body.data.id,
      ),
    );
  } finally {
    await Promise.all(ids.map((id) => db.doc(`orders/${id}`).delete()));
  }
});

test("receipts enforce ownership and paid reports reconcile with the dashboard", async () => {
  const placed = await request("/api/shop/placeOrder", checkout(), customer());
  const id = placed.body.data.id;
  const path = `/api/admin/orders/${id}`;
  const receipt = () => request("/api/shop/getReceipt", { order_id: id, total: 1, payment_status: "paid" }, customer());
  assert.equal((await request("/api/shop/getReceipt", { order_id: id })).status, 401);
  assert.equal((await request("/api/shop/getReceipt", { order_id: id }, owner())).status, 401);
  const initial = await receipt();
  assert.equal(initial.status, 200, JSON.stringify(initial.body));
  assert.equal(Buffer.from(initial.body.data.base64, "base64").subarray(0, 4).toString(), "%PDF");
  assert.match(initial.body.data.filename, /receipt\.pdf$/);
  const db = getFirestore(server);
  await db.doc(`orders/${id}`).update({ customer_uid: "qa-other" });
  assert.equal((await receipt()).status, 404, "A customer cannot download another account's receipt");
  await db.doc(`orders/${id}`).update({ customer_uid: "qa-customer" });
  const beforeReport = await request("/api/admin/dashboard", undefined, owner(), "GET");
  const paid = await request(path, { paymentStatus: "paid" }, owner(), "PATCH");
  assert.equal(paid.status, 200, JSON.stringify(paid.body));
  assert.ok(paid.body.item.paidAt);
  assert.equal(paid.body.item.orderStatus, "pending", "Payment does not require delivery");
  const afterReport = await request("/api/admin/dashboard", undefined, owner(), "GET");
  assert.equal(afterReport.body.stats.revenue - beforeReport.body.stats.revenue, placed.body.data.total);
  assert.equal(afterReport.body.sales.weekly.total - beforeReport.body.sales.weekly.total, placed.body.data.total);
  const tracking = await request(path, { trackingNumber: "123456789012" }, owner(), "PATCH");
  assert.equal(tracking.body.item.paidAt, paid.body.item.paidAt, "Tracking edits must preserve the payment date");
  assert.equal((await receipt()).status, 200);
  for (const period of ["weekly", "monthly"]) {
    const response = await fetch(`${origin}/api/admin/revenue-report?period=${period}`, { headers: owner() });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/pdf/);
    assert.match(response.headers.get("content-disposition"), /attachment/);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0, 4).toString(), "%PDF");
  }
  assert.equal((await fetch(origin + "/api/admin/revenue-report?period=weekly")).status, 401);
  const refund = await request(path, { paymentStatus: "refunded" }, owner(), "PATCH");
  assert.equal(refund.status, 200);
  const refunded = await request("/api/admin/dashboard", undefined, owner(), "GET");
  assert.equal(refunded.body.stats.revenue, beforeReport.body.stats.revenue);
});

test("the explicitly provisioned owner can log in before email verification without elevating delegates", async () => {
  const auth = getAuth(server);
  await auth.updateUser("qa-owner", { emailVerified: false });
  try {
    const login = await fetch(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "info@nourishspoon.com",
          password: "NourishQA!2026",
          returnSecureToken: true,
        }),
      },
    ).then((response) => response.json());
    const session = await request(
      "/api/auth/session",
      { idToken: login.idToken },
      { Origin: origin },
    );
    assert.equal(session.status, 200, JSON.stringify(session.body));
    assert.equal(
      (
        await request(
          "/api/admin/orders",
          undefined,
          { Cookie: session.cookie, Origin: origin },
          "GET",
        )
      ).status,
      200,
    );
  } finally {
    await auth.updateUser("qa-owner", { emailVerified: true });
  }
});
