# 🌿 Nourish Spoon — Mobile App & Admin Dashboard

> **Crafted with Love • Sargodha, Pakistan**  
> Premium Handcrafted Panjeeri, Date & Nut Energy Balls, and Traditional Pakistani Superfoods.

This repository contains the complete, production-ready, pixel-perfect **React Native Mobile App**, **Vite + React Admin Dashboard**, and **Supabase PostgreSQL Backend** built strictly according to the PRD specification and the 11 reference HD UI screens.

---

## 📁 Repository Structure

```text
nourish-spoon/
├── apps/
│   ├── mobile/                    # React Native (Expo) Mobile Application
│   │   ├── assets/                # High-res photography, jar cards, ingredients, icons
│   │   ├── src/
│   │   │   ├── components/        # Header, BottomTabBar, TrustBadges
│   │   │   ├── constants/         # Theme tokens (Light/Dark), Asset bundle mapper
│   │   │   ├── screens/           # 11 Pixel-Perfect Reference Screens
│   │   │   │   ├── SplashScreen.tsx          # Animated leaf splash & tagline
│   │   │   │   ├── OnboardingScreen.tsx      # 3-slide value onboarding flow
│   │   │   │   ├── HomeScreen.tsx            # Screen 01 HD: Hero food, Best-sellers, Delivery banner
│   │   │   │   ├── ProductsScreen.tsx        # Screen 02 HD: Category filter, search, 250g/500g toggle
│   │   │   │   ├── ProductDetailScreen.tsx   # Screens 03 & 04 HD: Jar hero, benefits, 14 ingredients
│   │   │   │   ├── WhatsAppOrderScreen.tsx   # Screen 05 HD: WhatsApp 1-tap order configurator
│   │   │   │   ├── PaymentDeliveryScreen.tsx # Screen 06 HD: JazzCash, EasyPaisa, Bank, TCS, Sargodha
│   │   │   │   ├── CustomerReviewsScreen.tsx # Screen 07 HD: WhatsApp screenshot bubbles & ratings
│   │   │   │   ├── OurStoryScreen.tsx        # Screen 08 HD: Founder Tayyaba narrative & 4-step craft
│   │   │   │   ├── FAQScreen.tsx             # Screen 09 HD: Accordion FAQs & WhatsApp CTA banner
│   │   │   │   └── ContactMoreScreen.tsx     # Screen 10 HD: Contact list, theme switch & socials
│   │   │   └── services/          # Zustand store, Supabase client & Mock Data
│   │   ├── App.tsx                # Master screen router & state coordinator
│   │   ├── app.json               # Expo configuration
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin/                     # Admin Dashboard (Vite + React + Tailwind + TypeScript)
│       ├── public/assets/         # Static assets, payment/delivery logos, jar cards
│       ├── src/
│       │   ├── components/        # Sidebar, Header, KPI Cards, Recharts, Orders Table, Modals
│       │   ├── pages/             # Dashboard, Orders, Products, Reviews, FAQs, Settings, etc.
│       │   ├── services/          # Supabase client, mock data & admin reactive store
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── tailwind.config.js
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── types/                     # Shared TypeScript models (Product, Order, Review, FAQ, etc.)
│   └── utils/                     # PKR formatting, WhatsApp payload generator, delivery helpers
│
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql # 18 tables, constraints, indexes & timestamp triggers
    │   ├── 002_rls_policies.sql   # Public read, customer order write, admin manage
    │   └── 003_storage_buckets.sql# Buckets for product photos, reviews, avatars & banners
    └── seed/
        └── seed.sql               # Complete initial seed data mirroring PRD & 11 HD screens
```

---

## ⚡ Supabase Configuration & Credentials

The application connects to your Supabase instance:

- **Supabase URL**: `https://pxcoixwchnfzwnricktu.supabase.co`
- **Supabase API Key**: Add your Supabase project API key to your local `.env` files (see `.env.example`).

### Applying Migrations to Supabase
You can execute the SQL files in `supabase/migrations/` and `supabase/seed/` directly via the Supabase Dashboard SQL Editor or via the Supabase CLI:

```bash
# Optional: Using Supabase CLI
npx supabase db push
```

---

## 🚀 Running the Admin Dashboard

```bash
cd apps/admin
npm install
npm run dev
```

The Admin Dashboard will be available at `http://localhost:5173`.
To build for production:
```bash
npm run build
```

---

## 📱 Running the Mobile App (React Native / Expo)

```bash
cd apps/mobile
npm install
npm start
```

- Press `w` to run in web browser (powered by `react-native-web`).
- Press `a` to run on connected Android device/emulator.
- Press `i` to run on iOS Simulator (macOS).
- Scan QR code with the **Expo Go** app on your physical iOS/Android device!

---

## 🎨 Design System & Palette

- **Primary Deep Forest Green**: `#0D5428` / `#073B21`
- **Parchment Cream Background**: `#FFF9EC` / `#FBF4E4`
- **Warm Pakistan Gold**: `#C99B36` / `#E2BB62`
- **WhatsApp Brand Green**: `#25D366`
- **Typography**: Classic Pakistani Serif headings with clean modern Sans-serif body.
- **Dark Mode**: Midnight forest palette (`#0C1B12`) with sage leaf accents (`#77A76A`).

---

## 💬 WhatsApp Order Flow
Orders are placed via one-tap WhatsApp prefilled messages formatted to Pakistani standard:
```text
Assalam-o-Alaikum Nourish Spoon!
I would like to place an order:

• 1x Date & Nuts Energy Balls (500g) - Rs. 3,899
Total: Rs. 3,899

Customer Details:
Name: Hira Malik
Phone: 0300 1234567
City: Sargodha
Delivery: Sargodha Same-Day Delivery
Payment: JazzCash
```

Crafted with dedication for **Nourish Spoon**.
