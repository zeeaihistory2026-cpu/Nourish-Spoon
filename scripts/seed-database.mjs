// Seeds the Nourish Spoon catalogue with the products shown in the design.
// Usage:
//   1. Download a service account key from Firebase console → Project settings → Service accounts
//   2. Save it as ./serviceAccountKey.json (git-ignored)
//   3. npm run seed
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

let credentials;
try {
  credentials = JSON.parse(await readFile('./serviceAccountKey.json', 'utf8'));
} catch {
  console.error(
    'Missing ./serviceAccountKey.json. Copy .env.example to .env and place the key next to it.'
  );
  process.exit(1);
}

initializeApp({ credential: cert(credentials) });
const db = getFirestore();

const IMG = {
  panjeeri: 'https://nourishspoon.com/assets/images/product-2-main.png',
  balls: 'https://nourishspoon.com/assets/images/product-1-main.png',
  banner: 'https://nourishspoon.com/assets/images/banner-2.png',
};

const categories = [
  { slug: 'panjeeri', name: 'Panjeeri', sortOrder: 1 },
  { slug: 'energy-balls', name: 'Energy Balls', sortOrder: 2 },
  { slug: 'ghee', name: 'Ghee', sortOrder: 3 },
  { slug: 'dates', name: 'Dates', sortOrder: 4 },
];

const products = [
  {
    slug: 'classic-panjeeri',
    name: 'Classic Panjeeri',
    categorySlug: 'panjeeri',
    description:
      'Slow-roasted in pure ghee with dates, almonds and pistachios — small-batch and preservative-free.',
    price: 1450,
    weight: '500g',
    stock: 24,
    images: [IMG.panjeeri],
    ingredients: ['Dates', 'Almonds', 'Pistachio', 'Pure Ghee', 'Whole Wheat'],
    benefits: [
      { icon: 'droplet', label: 'Rich in Healthy Fats' },
      { icon: 'sprout', label: 'Plant-Based Protein' },
      { icon: 'wheat', label: 'High in Dietary Fibre' },
      { icon: 'sparkles', label: 'Vitamins & Minerals' },
    ],
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
  },
  {
    slug: 'date-nut-balls',
    name: 'Date & Nut Balls',
    categorySlug: 'energy-balls',
    description:
      'Rolled dates and mixed nuts into bite-sized energy balls — the perfect school or office snack.',
    price: 1250,
    weight: '250g',
    stock: 30,
    images: [IMG.balls],
    ingredients: ['Dates', 'Almonds', 'Walnuts', 'Desiccated Coconut'],
    benefits: [
      { icon: 'droplet', label: 'Natural Sugars' },
      { icon: 'sprout', label: 'Protein Rich' },
      { icon: 'wheat', label: 'Dietary Fibre' },
      { icon: 'sparkles', label: 'No Added Sugar' },
    ],
    rating: 4.8,
    reviewCount: 96,
    isFeatured: true,
  },
  {
    slug: 'premium-ghee',
    name: 'Premium Ghee',
    categorySlug: 'ghee',
    description: 'Slow-churned desi ghee with a golden colour and nutty aroma, made in small batches.',
    price: 1850,
    weight: '400g',
    stock: 15,
    images: [IMG.banner],
    ingredients: ['Pure Cow Milk Butter'],
    benefits: [
      { icon: 'droplet', label: 'Healthy Fats' },
      { icon: 'sparkles', label: 'Traditionally Churned' },
      { icon: 'wheat', label: 'Lactose Friendly' },
      { icon: 'sprout', label: 'High Smoke Point' },
    ],
    rating: 4.9,
    reviewCount: 74,
    isFeatured: true,
  },
  {
    slug: 'whole-dates',
    name: 'Whole Dates',
    categorySlug: 'dates',
    description: 'Hand-picked soft dates, naturally sweet and packed with fibre and minerals.',
    price: 950,
    weight: '500g',
    stock: 40,
    images: [IMG.banner],
    ingredients: ['Dates'],
    benefits: [
      { icon: 'droplet', label: 'Natural Energy' },
      { icon: 'wheat', label: 'Fibre Rich' },
      { icon: 'sparkles', label: 'Hand Picked' },
      { icon: 'sprout', label: 'No Preservatives' },
    ],
    rating: 4.7,
    reviewCount: 58,
    isFeatured: true,
  },
];

const reviews = [
  {
    productSlug: 'classic-panjeeri',
    userName: 'Fatima K.',
    city: 'Lahore',
    rating: 5,
    daysAgo: 2,
    comment:
      "Tastes exactly like my grandmother's panjeeri. You can tell it's made with real ghee — nothing artificial at all.",
    verifiedPurchase: true,
  },
  {
    productSlug: 'date-nut-balls',
    userName: 'Ahmed H.',
    city: 'Karachi',
    rating: 5,
    daysAgo: 7,
    comment:
      "The energy balls are my kids' favourite school snack. Fresh, sealed properly and delivered the next day.",
    verifiedPurchase: true,
  },
  {
    productSlug: 'premium-ghee',
    userName: 'Sana R.',
    city: 'Islamabad',
    rating: 5,
    daysAgo: 14,
    comment: 'The aroma when you open the jar is incredible. Best desi ghee I have bought in years.',
    verifiedPurchase: true,
  },
];

const batch = db.batch();

const categoryIds = {};
for (const category of categories) {
  const ref = db.collection('categories').doc(category.slug);
  categoryIds[category.slug] = ref.id;
  batch.set(ref, { ...category, sortOrder: category.sortOrder }, { merge: true });
}

const productIds = {};
for (const product of products) {
  const ref = db.collection('products').doc(product.slug);
  productIds[product.slug] = ref.id;
  batch.set(
    ref,
    {
      ...product,
      categoryId: categoryIds[product.categorySlug],
      categoryName: categories.find((c) => c.slug === product.categorySlug)?.name ?? '',
      nameLower: product.name.toLowerCase(),
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

for (const review of reviews) {
  const ref = db.collection('reviews').doc();
  const createdAt = new Date(Date.now() - review.daysAgo * 24 * 60 * 60 * 1000);
  batch.set(ref, {
    productId: productIds[review.productSlug],
    productName: products.find((p) => p.slug === review.productSlug)?.name ?? '',
    userId: 'seed',
    userName: review.userName,
    city: review.city,
    rating: review.rating,
    comment: review.comment,
    verifiedPurchase: review.verifiedPurchase,
    createdAt,
  });
}

// Global rating summary shown on the Reviews tab.
const totalReviews = reviews.length;
const average = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
batch.set(db.doc('meta/reviewStats'), {
  average: Math.round(average * 10) / 10,
  count: totalReviews,
  distribution: reviews.reduce((acc, review) => {
    acc[String(review.rating)] = (acc[String(review.rating)] ?? 0) + 1;
    return acc;
  }, {}),
});

// Starting point for human-readable order numbers (#NS-20001+).
batch.set(db.doc('meta/orderCounter'), { count: 20000 }, { merge: true });

await batch.commit();
console.log(`Seeded ${categories.length} categories, ${products.length} products, ${reviews.length} reviews.`);
process.exit(0);
