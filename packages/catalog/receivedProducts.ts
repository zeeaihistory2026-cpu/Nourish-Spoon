import { Product } from "@packages/types";

/** Owner-supplied WhatsApp catalogue screenshots, received 12 October 2026.
 * Prices are a snapshot; stock and combo nutrition have not been supplied.
 */
export function createReceivedProducts(websiteProducts: Product[]): Product[] {
  const energy = websiteProducts.find(
    (product) => product.category === "energy_balls",
  )!;
  const make = (
    id: string,
    name: string,
    category: string,
    prices: Array<[string, number]>,
    template?: Product,
  ): Product => ({
    ...template,
    id,
    slug: id,
    name,
    category,
    short_description:
      template?.short_description ||
      "Homemade Panjeeri and Date & Nuts Energy Balls together in one pack.",
    description:
      template?.description ||
      "A pack of homemade Panjeeri and Date & Nuts Energy Balls. Confirm the Panjeeri sugar option and pack contents with our team before ordering.",
    featured_image:
      category === "combos"
        ? "bundle:combo"
        : category === "panjeeri"
          ? "bundle:panjeeri"
          : "bundle:energy-balls",
    rating: 0,
    review_count: 0,
    active: true,
    is_featured: category !== "combos",
    sort_order: 0,
    variants: prices.map(([weight, price], index) => ({
      id: `${id}:${weight}`,
      product_id: id,
      weight,
      regular_price: price,
      sale_price: null,
      price_per_100g: /^\d+g$/.test(weight)
        ? (price / parseInt(weight, 10)) * 100
        : null,
      stock: null,
      active: true,
      is_default: index === 0,
      sort_order: index + 1,
    })),
  });
  const products = [
    make(
      "date-and-nuts-energy-balls",
      "Date & Nuts Energy Balls",
      "energy_balls",
      [
        ["250g", 2199],
        ["500g", 4289],
      ],
      energy,
    ),
    make(
      "classic-panjeeri-with-sugar",
      "Classic Panjeeri with Sugar",
      "panjeeri",
      [
        ["250g", 1648],
        ["500g", 3189],
      ],
    ),
    make(
      "classic-panjeeri-without-sugar",
      "Classic Panjeeri without Sugar",
      "panjeeri",
      [
        ["250g", 1648],
        ["500g", 3189],
      ],
    ),
    ...[
      ["postpartum-care-combo", "Postpartum Care Combo"],
      ["energy-pack-combo", "Energy Pack Combo Deal"],
      ["family-combo", "Family Combo"],
      ["gym-freaks-combo", "Gym Freaks Combo Deal"],
      ["power-breakfast-combo", "Power Breakfast Combo"],
      ["daily-nourishment-pack", "Daily Nourishment Pack"],
    ].map(([id, name]) =>
      make(id, name, "combos", [
        [id === "daily-nourishment-pack" ? "Combo pack" : "250g combo", 3847],
      ]),
    ),
  ];
  for (const product of products.filter(
    (item) => item.category === "panjeeri",
  )) {
    product.short_description =
      "Homemade Panjeeri with premium nuts, seeds, desi ghee, khoya and aromatic cardamom.";
    product.description = `${product.short_description} ${product.name.endsWith("without Sugar") ? "Without added sugar; naturally occurring sugars may remain." : "Classic recipe with added sugar."}`;
    product.ingredients = [
      { id: "nuts", name: "Premium nuts", slug: "nuts", image_url: "" },
      { id: "seeds", name: "Seeds", slug: "seeds", image_url: "" },
      { id: "ghee", name: "Desi ghee", slug: "desi-ghee", image_url: "" },
      { id: "khoya", name: "Khoya (milk)", slug: "khoya", image_url: "" },
      { id: "cardamom", name: "Cardamom", slug: "cardamom", image_url: "" },
      ...(product.name.endsWith("without Sugar")
        ? []
        : [{ id: "sugar", name: "Added sugar", slug: "sugar", image_url: "" }]),
    ];
    product.ingredient_notes =
      "Key ingredients named in the supplied catalogue. This is not the complete ingredient list; check your selected jar’s label or contact our team for the exact nuts, seeds and allergen information.";
    product.nutrition_facts = [];
    product.storage_instructions =
      "Follow the storage instructions and date printed on your jar. Contact Nourish Spoon for this recipe’s confirmed shelf life.";
  }
  return products.map((product, index) => ({
    ...product,
    sort_order: index + 1,
  }));
}
