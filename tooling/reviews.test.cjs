const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module");
const ts = require("../apps/mobile/node_modules/typescript");
const mobileRequire = require("node:module").createRequire(
  path.resolve("apps/mobile/package.json"),
);

function screen(ownReviews = []) {
  const file = path.resolve(
    "apps/mobile/src/features/commerce/OrderDetailsScreen.tsx",
  );
  const watchOrders = () => {},
    watchOwnReviews = () => {};
  const item = {
    product_id: "energy",
    product_name: "Energy Balls",
    variant_id: "energy:250g",
    quantity: 1,
  };
  const order = {
    id: "delivered-order",
    status: "delivered",
    order_number: "NS-DEMO",
    items: [item, { ...item, variant_id: "energy:500g" }],
    created_at: "2026-10-21T00:00:00Z",
    payment_status: "paid",
    payment_method_code: "bank_transfer",
  };
  const components = Object.fromEntries(
    ["Page", "Card", "Heading", "Copy", "Message", "Field", "Choice"].map(
      (name) => [name, name],
    ),
  );
  const dependencies = {
    react: { useState: (initial) => [initial, () => {}] },
    "react-native": { View: "View", Image: "Image", Linking: {} },
    "@expo/vector-icons/Ionicons": "Icon",
    "../../hooks/useFormValidation": {
      useFormValidation: () => ({ bind: () => ({}), validate: () => true }),
    },
    "../../services/photos": { choosePhoto: async () => undefined },
    "./receiptDownload": { downloadReceipt: async () => {} },
    "../../components/AppTouchable": { TouchableOpacity: "Touchable" },
    "../../components/DesignPrimitives": { GreenButton: "GreenButton" },
    "./components": components,
    "./service": {
      watchOrders,
      watchOwnReviews,
      call: async () => ({}),
      commerceError: String,
    },
    "./useAccountData": {
      useAccountData: (watch) => ({
        items: watch === watchOrders ? [order] : ownReviews,
        loading: false,
        error: "",
      }),
    },
    "../../services/storeService": {
      useMobileStore: () => ({
        products: [],
        settings: { whatsapp_number: "923001234567" },
        theme: { gold: "#A96819" },
      }),
    },
    "./OrderDetailsView": { OrderDetailsView: "OrderDetailsView" },
  };
  const mod = new Module(file);
  mod.require = (name) =>
    Object.hasOwn(dependencies, name)
      ? dependencies[name]
      : mobileRequire(name);
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
  return mod.exports.OrderDetailsScreen({
    navigation: { navigate() {}, goBack() {} },
    orderId: order.id,
  });
}
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
test("a delivered order renders immediately with five stars and one choice per purchased product", () => {
  const tree = nodes(screen());
  assert.equal(
    tree.filter((node) => node.type === "Icon" && node.props.name === "star")
      .length,
    5,
  );
  assert.equal(tree.filter((node) => node.type === "Choice").length, 1);
  assert.ok(tree.some((node) => node.props?.title === "Submit Review"));
  assert.ok(
    tree.some((node) => node.props?.title === "Add a photo (optional)"),
  );
});
test("an already submitted review shows its status without offering a duplicate form", () => {
  const tree = nodes(
    screen([
      {
        id: "review",
        order_id: "delivered-order",
        product_id: "energy",
        product_name: "Energy Balls",
        status: "pending",
      },
    ]),
  );
  assert.ok(!tree.some((node) => node.props?.title === "Submit Review"));
  assert.ok(JSON.stringify(tree).includes("Waiting for approval"));
});

function loadReviewModule(relative, dependencies) {
  const file = path.resolve("apps/mobile/src", relative);
  const mod = new Module(file);
  mod.require = (name) =>
    Object.hasOwn(dependencies, name)
      ? dependencies[name]
      : mobileRequire(name);
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    file,
  );
  return mod.exports;
}
const nativeReviewMocks = {
  View: "View",
  Text: "Text",
  Image: "Image",
  Modal: "Modal",
  ScrollView: "ScrollView",
  StyleSheet: { create: (value) => value, absoluteFill: {} },
  useWindowDimensions: () => ({ height: 844 }),
  Share: {},
};

test("approved purchase reviews and website testimonials render through the same card; pending and hidden reviews stay private", () => {
  const fixture = {
    id: "purchase",
    status: "approved",
    customer_name: "Customer",
    location: "Lahore",
    rating: 5,
    product_name: "Energy Balls",
    product_id: "energy",
    comment: "Lovely flavour",
    verified: true,
    has_photo: true,
  };
  const module = loadReviewModule("screens/CustomerReviewsScreen.tsx", {
    react: { useState: (initial) => [initial, () => {}] },
    "react-native": nativeReviewMocks,
    "@expo/vector-icons/Ionicons": "Icon",
    "../components/AppTouchable": { TouchableOpacity: "Touchable" },
    "../components/Header": { Header: "Header" },
    "../components/DesignPrimitives": { GreenButton: "Button" },
    "../components/CustomerReviewCard": {
      CustomerReviewCard: "ReviewCard",
      REVIEW_FONTS: {},
    },
    "../services/storeService": {
      useMobileStore: () => ({
        theme: {},
        products: [{ id: "energy", category: "energy_balls" }],
        reviews: [
          fixture,
          { ...fixture, id: "pending", status: "pending" },
          { ...fixture, id: "hidden", status: "hidden" },
        ],
      }),
    },
    "../data/websiteReviews": {
      WEBSITE_REVIEWS: [
        {
          id: "website",
          name: "Website Customer",
          rating: 5,
          productName: "Panjeeri",
          category: "panjeeri",
        },
      ],
    },
  });
  const cards = nodes(module.CustomerReviewsScreen({})).filter(
    (node) => node.type === "ReviewCard",
  );
  assert.deepEqual(
    cards.map((card) => card.props.review.id),
    ["purchase", "website"],
  );
  assert.equal(cards[0].props.review.photoId, "purchase");
  assert.equal(cards[0].props.review.category, "energy-balls");
  assert.equal(cards[0].props.review.verified, true);
});

test("purchase review card shows five star icons and opens the uploaded image without cropping it in the viewer", () => {
  let media;
  const module = loadReviewModule("components/CustomerReviewCard.tsx", {
    "react-native": nativeReviewMocks,
    "@expo/vector-icons/Ionicons": "Icon",
    "./AppTouchable": { TouchableOpacity: "Touchable" },
    "../services/photos": {
      useRemotePhoto: (path) =>
        path === "reviews/purchase/media/photo"
          ? "data:image/jpeg;base64,photo"
          : undefined,
    },
    "../constants/theme": { BUTTON_OUTLINE: {} },
  });
  const tree = nodes(
    module.CustomerReviewCard({
      review: {
        id: "purchase",
        name: "Customer",
        location: "Lahore",
        rating: 5,
        productName: "Energy Balls",
        comment: "Lovely flavour",
        verified: true,
        helpful: 0,
        photoId: "purchase",
      },
      theme: {},
      voted: false,
      onVote() {},
      onShare() {},
      onOpenMedia: (value) => {
        media = value;
      },
    }),
  );
  assert.equal(
    tree.filter((node) => node.type === "Icon" && node.props.name === "star")
      .length,
    5,
  );
  assert.ok(JSON.stringify(tree).includes("CUSTOMER PHOTO"));
  tree
    .find(
      (node) => node.props?.accessibilityLabel === "View photo from Customer",
    )
    .props.onPress();
  assert.equal(media.source.uri, "data:image/jpeg;base64,photo");
  assert.equal(media.name, "Customer");
});
