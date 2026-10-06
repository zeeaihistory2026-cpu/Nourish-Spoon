/**
 * Seeds the Firestore `products` and `categories` collections from the
 * demo catalogue. Run once:
 *
 *   XDG_CONFIG_HOME=/home/hatch/.firebase-config \
 *   FIREBASE_PROJECT=nourish-spoon-f4820 \
 *   npx tsx scripts/seed-products.ts
 *
 * Uses the Admin SDK via firebase-tools credentials (application default).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Reuse the service-account-free approach: firebase-tools stores a refresh
// token; we exchange it via the Admin SDK's default credential chain is not
// available here, so we fall back to the REST API with an OAuth access token.
const PROJECT = process.env.FIREBASE_PROJECT ?? 'nourish-spoon-f4820';

interface SeedProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  compareAtPrice?: number;
  variants: { label: string; price: number; compareAtPrice?: number; per100g?: string }[];
  weight: string;
  stock: number;
  ingredients: { name: string; emoji?: string }[];
  benefits: { icon: string; label: string }[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

const COMMON_BENEFITS = [
  { icon: 'leaf', label: 'No refined sugar' },
  { icon: 'wheat', label: 'Wholesome ingredients' },
  { icon: 'shield', label: 'Hygienic homemade quality' },
  { icon: 'sparkles', label: 'Freshly prepared' },
];

const BALLS_INGREDIENTS = [
  { name: 'Dates', emoji: '🫘' },
  { name: 'Almonds', emoji: '🌰' },
  { name: 'Walnuts', emoji: '🌰' },
  { name: 'Cashews', emoji: '🥜' },
  { name: 'Raisins', emoji: '🍇' },
  { name: 'Figs', emoji: '🫒' },
  { name: 'Coconut', emoji: '🥥' },
  { name: 'Desi Ghee', emoji: '🧈' },
  { name: 'Cardamom', emoji: '🌿' },
  { name: 'Lotus Seeds', emoji: '🤍' },
  { name: 'Pumpkin Seeds', emoji: '🎃' },
  { name: 'Sunflower Seeds', emoji: '🌻' },
  { name: 'White Sesame Seeds', emoji: '🌾' },
];

const PANJEERI_INGREDIENTS = [
  { name: 'Almonds', emoji: '🌰' },
  { name: 'Walnuts', emoji: '🌰' },
  { name: 'Cashews', emoji: '🥜' },
  { name: 'Raisins', emoji: '🍇' },
  { name: 'Dry Dates', emoji: '🫘' },
  { name: 'Cardamom', emoji: '🌿' },
  { name: 'Coconut', emoji: '🥥' },
  { name: 'Semolina (Suji)', emoji: '🌾' },
  { name: 'Pure Desi Ghee', emoji: '🧈' },
  { name: 'Lotus Seeds (Makhana)', emoji: '🤍' },
  { name: 'Pumpkin Seeds', emoji: '🎃' },
  { name: 'Sunflower Seeds', emoji: '🌻' },
];

const PRODUCTS: SeedProduct[] = [
  {
    id: 'date-nut-balls',
    name: 'Date & Nuts Energy Balls',
    description:
      'Naturally sweetened, nutrient-dense and packed with wholesome ingredients. No refined sugar.',
    categoryId: 'energy-balls',
    categoryName: 'Energy Balls',
    price: 1999,
    compareAtPrice: 2199,
    variants: [
      { label: '250g', price: 1999, compareAtPrice: 2199, per100g: 'Rs. 7.996 per 100g' },
      { label: '500g', price: 3899, per100g: 'Rs. 7.798 per 100g' },
    ],
    weight: '250g',
    stock: 25,
    ingredients: BALLS_INGREDIENTS,
    benefits: COMMON_BENEFITS,
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'homemade-panjeeri',
    name: 'Homemade Panjeeri',
    description:
      'Traditional family recipe made with pure desi ghee, healthy fats, protein and essential nutrients.',
    categoryId: 'panjeeri',
    categoryName: 'Panjeeri',
    price: 1499,
    variants: [
      { label: '250g', price: 1499, per100g: 'Rs. 5.996 per 100g' },
      { label: '500g', price: 2899, per100g: 'Rs. 5.798 per 100g' },
    ],
    weight: '250g',
    stock: 25,
    ingredients: PANJEERI_INGREDIENTS,
    benefits: COMMON_BENEFITS,
    rating: 4.9,
    reviewCount: 62,
    isFeatured: true,
    isActive: true,
  },
];

const CATEGORIES = [
  { id: 'energy-balls', name: 'Energy Balls', slug: 'energy-balls', sortOrder: 1 },
  { id: 'panjeeri', name: 'Panjeeri', slug: 'panjeeri', sortOrder: 2 },
];

async function getAccessToken(): Promise<string> {
  // firebase-tools stores OAuth tokens in its configstore.
  const configHome = process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), '.config');
  const storePath = path.join(configHome, 'configstore', 'firebase-tools.json');
  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
  const tokens = store.tokens;
  if (!tokens?.access_token) {
    throw new Error('No Firebase access token found — run `firebase login` first.');
  }
  return tokens.access_token as string;
}

async function firestoreWrite(
  accessToken: string,
  collection: string,
  docId: string,
  fields: Record<string, unknown>
) {
  // Convert plain JS to Firestore REST value format.
  function toValue(v: unknown): unknown {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'string') return { stringValue: v };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number')
      return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
    if (typeof v === 'object')
      return {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(v as Record<string, unknown>).map(([k, val]) => [k, toValue(val)])
          ),
        },
      };
    return { stringValue: String(v) };
  }

  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT}` +
    `/databases/(default)/documents/${collection}/${docId}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: Object.fromEntries(
        Object.entries(fields).map(([k, v]) => [k, toValue(v)])
      ),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Write ${collection}/${docId} failed (${res.status}): ${text.slice(0, 300)}`);
  }
}

async function main() {
  const token = await getAccessToken();

  for (const cat of CATEGORIES) {
    await firestoreWrite(token, 'categories', cat.id, { ...cat });
    console.log(`  category: ${cat.id}`);
  }

  for (const p of PRODUCTS) {
    const { id, name, ...rest } = p;
    await firestoreWrite(token, 'products', id, {
      name,
      nameLower: name.toLowerCase(),
      slug: id,
      ...rest,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`  product: ${id}`);
  }

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
