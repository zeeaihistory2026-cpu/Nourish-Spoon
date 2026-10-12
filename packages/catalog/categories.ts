export const PRODUCT_CATEGORIES = [
  { id: "all", label: "All", icon: "grid-outline" },
  { id: "panjeeri", label: "Panjeeri", icon: "leaf-outline" },
  { id: "energy_balls", label: "Energy Balls", icon: "nutrition-outline" },
  { id: "combos", label: "Combos", icon: "gift-outline" },
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]["id"];
