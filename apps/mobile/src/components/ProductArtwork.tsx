import { Image } from "react-native";
import { Product } from "@packages/types";
import { ASSETS } from "../constants/assets";

/** Full product artwork in a consistent 3:2 frame; small cart thumbnails use contain. */
export function ProductArtwork({
  product,
  photograph = false,
}: {
  product: Product;
  photograph?: boolean;
}) {
  const remote = /^https:\/\//.test(product.featured_image);
  const source = remote
    ? { uri: product.featured_image }
    : product.category === "combos"
      ? ASSETS.comboCard
      : product.category === "panjeeri"
        ? photograph
          ? ASSETS.panjeeriCardPhoto
          : ASSETS.panjeeriCard
        : photograph
          ? ASSETS.energyBallsCardPhoto
          : ASSETS.energyBallsCard;
  return (
    <Image
      source={source}
      resizeMode="contain"
      resizeMethod="resize"
      style={{
        width: "100%",
        height: "100%",
        transform:
          photograph && !remote && product.category !== "combos"
            ? [{ scale: 1.25 }]
            : undefined,
      }}
      accessibilityLabel={product.name}
    />
  );
}
