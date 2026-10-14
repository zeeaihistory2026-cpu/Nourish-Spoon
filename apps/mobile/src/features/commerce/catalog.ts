import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useMobileStore } from "../../services/storeService";
import {
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
} from "@packages/catalog/websiteSnapshot";
import { normalizeProduct } from "@packages/catalog/normalizeProduct";
import { Product, Review } from "@packages/types";
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
export function mergeCatalogueDocuments(
  documents: Array<{ id: string; data: () => Record<string, any> }>,
): Product[] {
  // Retired records must be excluded from BOTH published entries and fallback matching.
  // Otherwise a retired Energy Balls record can hide its bundled replacement by name.
  const currentDocs = documents.filter(
    (document) =>
      !["date-nut-balls", "homemade-panjeeri"].includes(document.id),
  );
  const published = currentDocs
    .map((document) =>
      normalizeProduct(
        document.id,
        document.data(),
        INITIAL_PRODUCTS.find((product) =>
          matchesProduct(product, document.id, document.data()),
        ),
      ),
    )
    .filter((product) => product.active && product.variants.length);
  const products = [
    ...INITIAL_PRODUCTS.filter(
      (product) =>
        !currentDocs.some((document) =>
          matchesProduct(product, document.id, document.data()),
        ),
    ),
    ...published,
  ];
  return products.sort((a, b) => a.sort_order - b.sort_order);
}
export function subscribeCatalogue() {
  if (!db) return () => {};
  const products = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      if (snapshot.empty) return;
      useMobileStore
        .getState()
        .setProducts(mergeCatalogueDocuments(snapshot.docs));
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
