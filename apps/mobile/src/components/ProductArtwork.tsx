import React from "react";
import { Image } from "react-native";
import { Product } from "@packages/types";
import { ASSETS } from "../constants/assets";

/** Full product artwork in a consistent 3:2 frame; small cart thumbnails use contain. */
export function ProductArtwork({ product }: { product: Product }) {
  const source = /^https:\/\//.test(product.featured_image)
    ? { uri: product.featured_image }
    : product.category === "combos"
      ? ASSETS.comboCard
      : product.category === "panjeeri"
        ? ASSETS.panjeeriCard
        : ASSETS.energyBallsCard;
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={{ width: "100%", height: "100%" }}
      accessibilityLabel={product.name}
    />
  );
}
