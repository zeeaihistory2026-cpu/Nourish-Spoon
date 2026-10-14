import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useMobileStore } from "../../services/storeService";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
} from "@packages/catalog/websiteSnapshot";
import { normalizeProduct } from "@packages/catalog/normalizeProduct";
import { Review } from "@packages/types";
function matchesProduct(
  product: (typeof INITIAL_PRODUCTS)[number],
  id: string,
  raw: { slug?: string; name?: string },
) {
  return (
    product.id === id ||
    (!!raw.slug && product.slug === raw.slug) ||
    (!!raw.name &&
      product.name.trim().toLowerCase() === raw.name.trim().toLowerCase())
  );
}
export function subscribeCatalogue() {
  if (!db) return () => {};
  const products = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      // Before the owner imports the catalogue, bundled website content remains available for browsing.
      if (snapshot.empty) return;
      const published = snapshot.docs
        // These two old generic SKUs are superseded by the owner's recipe-specific catalogue.
        .filter(
          (doc) => !["date-nut-balls", "homemade-panjeeri"].includes(doc.id),
        )
        .map((doc) =>
          normalizeProduct(
            doc.id,
            doc.data(),
            INITIAL_PRODUCTS.find((product) =>
              matchesProduct(product, doc.id, doc.data()),
            ),
          ),
        )
        .filter((product) => product.active && product.variants.length);
      // Bundled owner additions stay browsable until imported; a published exact SKU
      // overrides its snapshot, including an inactive SKU (which stays hidden).
      const products = [
        ...INITIAL_PRODUCTS.filter(
          (product) =>
            !snapshot.docs.some((doc) =>
              matchesProduct(product, doc.id, doc.data()),
            ),
        ),
        ...published,
      ];
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
