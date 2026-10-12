import { OrderEditor } from "./OrderEditor";
import { ProductEditor } from "./ProductEditor";
import React, { useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Product, Review } from "@packages/types";
import { Purchase } from "@packages/types/commerce";
import { INITIAL_PRODUCTS } from "@packages/catalog/websiteSnapshot";
import { normalizeProduct } from "@packages/catalog/normalizeProduct";
import { auth, database, functions, configured } from "./firebase";
import "./admin.css";
type Section = "Orders" | "Products" | "Reviews" | "Delivery";
export default function CommerceAdmin() {
  const [user, setUser] = useState<User | null>(auth?.currentUser || null),
    [allowed, setAllowed] = useState(false);
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [section, setSection] = useState<Section>("Orders");
  const [orders, setOrders] = useState<Purchase[]>([]),
    [products, setProducts] = useState<Product[]>([]),
    [reviews, setReviews] = useState<Review[]>([]);
  const [firstFree, setFirstFree] = useState(false),
    [tcs, setTcs] = useState(""),
    [local, setLocal] = useState("");
  useEffect(
    () =>
      auth
        ? onAuthStateChanged(auth, async (account) => {
            setUser(account);
            const token = await account?.getIdTokenResult();
            setAllowed(
              !!account &&
                (token?.claims.admin === true ||
                  (account.emailVerified &&
                    account.email === "info@nourishspoon.com")),
            );
          })
        : undefined,
    [],
  );
  useEffect(() => {
    if (!allowed || !database) return;
    const failed = (error: any) =>
      setError(error.message || "Could not load Firebase data.");
    const stop = [
      onSnapshot(
        collection(database, "orders"),
        (snapshot) =>
          setOrders(
            snapshot.docs
              .map((doc) => ({ ...doc.data(), id: doc.id }) as Purchase)
              .sort((a, b) => b.created_at.localeCompare(a.created_at)),
          ),
        failed,
      ),
      onSnapshot(
        collection(database, "products"),
        (snapshot) =>
          setProducts(
            snapshot.docs.map((doc) =>
              normalizeProduct(
                doc.id,
                doc.data(),
                INITIAL_PRODUCTS.find(
                  (product) =>
                    product.id === doc.id || product.slug === doc.data().slug,
                ),
              ),
            ),
          ),
        failed,
      ),
      onSnapshot(
        collection(database, "reviews"),
        (snapshot) =>
          setReviews(
            snapshot.docs.map(
              (doc) => ({ ...doc.data(), id: doc.id }) as Review,
            ),
          ),
        failed,
      ),
      onSnapshot(
        doc(database, "settings", "commerce"),
        (snapshot) => {
          const data = snapshot.data() || {};
          setFirstFree(data.first_order_free_delivery === true);
          setTcs(data.delivery_fees?.tcs_nationwide?.toString() || "");
          setLocal(data.delivery_fees?.sargodha_sameday?.toString() || "");
        },
        failed,
      ),
    ];
    return () => stop.forEach((unsubscribe) => unsubscribe());
  }, [allowed]);
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (error: any) {
      setError(error.message || "Could not save. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (!configured)
    return (
      <main className="admin-shell">
        <h1>Nourish Spoon Admin</h1>
        <p>
          Firebase configuration is missing. Add the public web-app
          configuration to apps/admin/.env using .env.example.
        </p>
      </main>
    );
  if (!user)
    return (
      <main className="admin-login">
        <h1>Nourish Spoon</h1>
        <p>Owner sign-in</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            run(() =>
              signInWithEmailAndPassword(auth!, email.trim(), password),
            );
          }}
        >
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button disabled={busy}>Sign In</button>
        </form>
        <button
          className="secondary"
          disabled={busy || !email}
          onClick={() =>
            run(async () => {
              await sendPasswordResetEmail(auth!, email.trim());
              setError("Password reset email sent.");
            })
          }
        >
          Reset Password
        </button>
        <p role="alert">{error}</p>
      </main>
    );
  if (!allowed)
    return (
      <main className="admin-login">
        <h1>Owner access required</h1>
        <p>
          Use the verified info@nourishspoon.com account, or an account with a
          server-issued admin claim.
        </p>
        {!user.emailVerified && (
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                await sendEmailVerification(user);
                setError(
                  "Check your email, verify ownership, then sign in again.",
                );
              })
            }
          >
            Send Verification Email
          </button>
        )}
        <button onClick={() => signOut(auth!)}>Sign Out</button>
        <p role="alert">{error}</p>
      </main>
    );
  return (
    <div className="admin-layout">
      <aside>
        <h1>Nourish Spoon</h1>
        <p>Owner dashboard</p>
        {(["Orders", "Products", "Reviews", "Delivery"] as Section[]).map(
          (name) => (
            <button
              className={section === name ? "" : "secondary"}
              key={name}
              onClick={() => setSection(name)}
            >
              {name}
            </button>
          ),
        )}
        <button className="secondary" onClick={() => signOut(auth!)}>
          Sign Out
        </button>
      </aside>
      <main className="admin-shell">
        <h2>{section}</h2>
        <p role="alert">{error}</p>
        {section === "Orders" && (
          <>
            {!orders.length && (
              <p>No orders have been placed through the app.</p>
            )}
            {orders.map((order) => (
              <OrderEditor
                key={order.id}
                order={order}
                busy={busy}
                save={(patch) =>
                  run(() =>
                    httpsCallable(
                      functions!,
                      "updateOrder",
                    )({ id: order.id, ...patch }),
                  )
                }
              />
            ))}
          </>
        )}
        {section === "Products" && (
          <>
            {INITIAL_PRODUCTS.some(
              (product) =>
                !products.some(
                  (published) =>
                    published.id === product.id ||
                    published.slug === product.slug,
                ),
            ) && (
              <article>
                <h3>Add the updated product catalogue</h3>
                <p>
                  Adds missing recipes and combos from the owner’s October 12
                  screenshots. Existing product prices are preserved. Stock is
                  unmanaged until you enter quantities. Review pack contents
                  before sale.
                </p>
                <button
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      for (const product of INITIAL_PRODUCTS.filter(
                        (product) =>
                          !products.some(
                            (published) =>
                              published.id === product.id ||
                              published.slug === product.slug,
                          ),
                      )) {
                        await runTransaction(database!, async (transaction) => {
                          const reference = doc(
                            database!,
                            "products",
                            product.id,
                          );
                          const existing = await transaction.get(reference);
                          if (!existing.exists())
                            transaction.set(reference, product);
                        });
                      }
                    })
                  }
                >
                  Add Missing Products
                </button>
              </article>
            )}
            {products.map((product) => (
              <ProductEditor
                key={product.id}
                product={product}
                busy={busy}
                save={(patch) =>
                  run(() =>
                    updateDoc(doc(database!, "products", product.id), patch),
                  )
                }
              />
            ))}
          </>
        )}
        {section === "Reviews" && (
          <>
            {!reviews.length && <p>No customer reviews awaiting moderation.</p>}
            {reviews.map((review) => (
              <article key={review.id}>
                <h3>
                  {review.customer_name} · {review.rating}★
                </h3>
                <p>
                  {review.product_name} · {review.status}
                </p>
                <p>{review.comment}</p>
                <button
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      updateDoc(doc(database!, "reviews", review.id), {
                        status: "approved",
                      }),
                    )
                  }
                >
                  Approve
                </button>
                <button
                  className="secondary"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      updateDoc(doc(database!, "reviews", review.id), {
                        status: "hidden",
                      }),
                    )
                  }
                >
                  Hide
                </button>
              </article>
            ))}
          </>
        )}
        {section === "Delivery" && (
          <article>
            <h3>Delivery fees</h3>
            <p>
              Leave a fee empty to quote it per order. Enter zero only when
              delivery is actually free.
            </p>
            <label>
              TCS Nationwide (PKR)
              <input
                type="number"
                min="0"
                max="10000"
                step="1"
                value={tcs}
                onChange={(event) => setTcs(event.target.value)}
              />
            </label>
            <label>
              Sargodha same-day (PKR)
              <input
                type="number"
                min="0"
                max="10000"
                step="1"
                value={local}
                onChange={(event) => setLocal(event.target.value)}
              />
            </label>
            <label>
              <input
                type="checkbox"
                checked={firstFree}
                onChange={(event) => setFirstFree(event.target.checked)}
              />{" "}
              Free delivery for first orders of PKR 2,500+
            </label>
            <button
              disabled={busy}
              onClick={() =>
                run(async () => {
                  const fees = [tcs, local].map((value) =>
                    value === "" ? null : Number(value),
                  );
                  if (
                    fees.some(
                      (value) =>
                        value !== null &&
                        (!Number.isInteger(value) ||
                          value < 0 ||
                          value > 10000),
                    )
                  )
                    throw new Error("Enter valid whole-number delivery fees.");
                  await setDoc(doc(database!, "settings", "commerce"), {
                    first_order_free_delivery: firstFree,
                    delivery_fees: {
                      tcs_nationwide: fees[0],
                      sargodha_sameday: fees[1],
                    },
                  });
                })
              }
            >
              Save Delivery Settings
            </button>
          </article>
        )}
      </main>
    </div>
  );
}
