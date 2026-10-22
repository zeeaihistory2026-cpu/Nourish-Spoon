import { before, after, test } from "node:test";
import fs from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
let env;
before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-nourish-spoon",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: fs.readFileSync(
        new URL("../firestore.rules", import.meta.url),
        "utf8",
      ),
    },
  });
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "orders/o"), {
      customer_uid: "alice",
      status: "delivered",
    });
    await setDoc(doc(db, "users/alice/notifications/n"), {
      title: "Order updated",
      read: false,
    });
    await setDoc(doc(db, "nativeSessions/s"), {
      uid: "alice",
      challenge: "secret",
    });
    await setDoc(doc(db, "reviews/r"), {
      status: "pending",
      customer_uid: "alice",
    });
  });
});
after(async () => {
  await env?.cleanup();
});
test("profile photos stay private and review photos follow approval without client writes", async () => {
  const profile = "users/alice/media/profile",
    review = "reviews/r/media/photo";
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), profile), { data: "private photo" });
    await setDoc(doc(context.firestore(), review), {
      data: "pending review photo",
    });
  });
  const alice = env.authenticatedContext("alice").firestore();
  const bob = env.authenticatedContext("bob").firestore();
  await assertSucceeds(getDoc(doc(alice, profile)));
  await assertFails(getDoc(doc(bob, profile)));
  await assertFails(setDoc(doc(alice, profile), { data: "unvalidated photo" }));
  await assertSucceeds(getDoc(doc(alice, review)));
  await assertFails(getDoc(doc(bob, review)));
  await assertFails(setDoc(doc(alice, review), { data: "unvalidated photo" }));
  await env.withSecurityRulesDisabled((context) =>
    updateDoc(doc(context.firestore(), "reviews/r"), { status: "approved" }),
  );
  await assertSucceeds(getDoc(doc(bob, review)));
  await env.withSecurityRulesDisabled((context) =>
    updateDoc(doc(context.firestore(), "reviews/r"), { status: "pending" }),
  );
});
test("reward wallets are private and customers cannot credit points or create promos", async () => {
  await env.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "rewardWallets/alice"), {
      balance: 100,
    });
  });
  const alice = env.authenticatedContext("alice").firestore();
  await assertSucceeds(getDoc(doc(alice, "rewardWallets/alice")));
  await assertFails(
    getDoc(
      doc(env.authenticatedContext("bob").firestore(), "rewardWallets/alice"),
    ),
  );
  await assertFails(
    updateDoc(doc(alice, "rewardWallets/alice"), { balance: 99999 }),
  );
  await assertFails(setDoc(doc(alice, "promoCodes/FREE"), { value: 100 }));
  await assertFails(getDoc(doc(alice, "referralCodes/SECRET")));
});
test("orders readable only by purchaser or verified owner", async () => {
  await assertSucceeds(
    getDoc(doc(env.authenticatedContext("alice").firestore(), "orders/o")),
  );
  await assertFails(
    getDoc(doc(env.authenticatedContext("bob").firestore(), "orders/o")),
  );
  await assertFails(
    getDoc(doc(env.unauthenticatedContext().firestore(), "orders/o")),
  );
  await assertSucceeds(
    getDoc(
      doc(
        env
          .authenticatedContext("owner", {
            email: "info@nourishspoon.com",
            email_verified: true,
          })
          .firestore(),
        "orders/o",
      ),
    ),
  );
  await assertFails(
    getDoc(
      doc(
        env
          .authenticatedContext("impostor", {
            email: "info@nourishspoon.com",
            email_verified: false,
          })
          .firestore(),
        "orders/o",
      ),
    ),
  );
});
test("clients cannot invent orders or set paid/delivered state", async () => {
  const db = env.authenticatedContext("alice").firestore();
  await assertFails(
    setDoc(doc(db, "orders/fake"), { customer_uid: "alice", total: 1 }),
  );
  await assertFails(
    updateDoc(doc(db, "orders/o"), {
      status: "delivered",
      payment_status: "paid",
    }),
  );
});
test("address privacy, schema and custom-city support", async () => {
  const db = env.authenticatedContext("alice").firestore();
  await assertSucceeds(
    setDoc(doc(db, "users/alice/addresses/a"), {
      label: "Home",
      name: "Alice",
      phone: "03001234567",
      city: "Chiniot",
      line: "Street 4",
    }),
  );
  await assertFails(
    getDoc(
      doc(
        env.authenticatedContext("bob").firestore(),
        "users/alice/addresses/a",
      ),
    ),
  );
  await assertFails(
    setDoc(doc(db, "users/alice/addresses/b"), {
      label: "Home",
      name: "Alice",
      phone: "0",
      city: "X",
      line: "Y",
      admin: true,
    }),
  );
});
test("notification content cannot be rewritten by customer", async () => {
  const db = env.authenticatedContext("alice").firestore();
  await assertSucceeds(
    updateDoc(doc(db, "users/alice/notifications/n"), { read: true }),
  );
  await assertFails(
    updateDoc(doc(db, "users/alice/notifications/n"), {
      title: "Fake paid order",
    }),
  );
});
test("pending reviews private and auth handoff inaccessible", async () => {
  await assertFails(
    getDoc(doc(env.unauthenticatedContext().firestore(), "reviews/r")),
  );
  await assertSucceeds(
    getDoc(doc(env.authenticatedContext("alice").firestore(), "reviews/r")),
  );
  await assertFails(
    getDoc(
      doc(env.authenticatedContext("alice").firestore(), "nativeSessions/s"),
    ),
  );
});
