import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useMobileStore } from "../../services/storeService";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
} from "@packages/catalog/websiteSnapshot";
import { normalizeProduct } from "@packages/catalog/normalizeProduct";
import { Review } from "@packages/types";
export function subscribeCatalogue() {
  if (!db) return () => {};
  const products = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      // Before the owner imports the catalogue, bundled website content remains available for browsing.
      if (snapshot.empty) return;
      const products = snapshot.docs
        .map((doc) =>
          normalizeProduct(
            doc.id,
            doc.data(),
            INITIAL_PRODUCTS.find(
              (product) =>
                product.category ===
                (/panjeeri/i.test(doc.data().name || doc.id)
                  ? "panjeeri"
                  : "energy_balls"),
            ),
          ),
        )
        .filter((product) => product.active && product.variants.length);
      useMobileStore
        .getState()
        .setProducts(products.sort((a, b) => a.sort_order - b.sort_order));
    },
    () => {},
  );
  const reviews = onSnapshot(
    query(collection(db, "reviews"), where("status", "==", "approved")),
    (snapshot) => {
      useMobileStore.setState({
        reviews: [
          ...INITIAL_REVIEWS,
          ...snapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id }) as Review,
          ),
        ],
      });
    },
    () => {},
  );
  return () => {
    products();
    reviews();
  };
}
