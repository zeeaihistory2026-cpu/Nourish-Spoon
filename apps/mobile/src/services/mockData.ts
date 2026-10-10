import { Product, Order, Review, FAQ, PaymentMethod, DeliveryMethod, BrandIdentity, FounderStory } from '@packages/types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    name: 'Date & Nuts Energy Balls',
    slug: 'date-and-nuts-energy-balls',
    tagline: 'Naturally Sweetened • Pure Ingredients • No Refined Sugar',
    short_description: 'Naturally sweetened, nutrient-dense and packed with wholesome ingredients. No refined sugar.',
    description: 'Our signature Date & Nuts Energy Balls are handcrafted with handpicked Arabian dates, crunchy almonds, walnuts, cashews, figs, and toasted seeds. Slow rolled in small batches with a touch of pure desi ghee and fragrant cardamom.',
    category: 'energy_balls',
    featured_image: '/assets/products/energy_balls_detail_hero.jpg',
    rating: 4.9,
    review_count: 48,
    badge_label: 'Best Seller',
    is_featured: true,
    active: true,
    sort_order: 1,
    storage_instructions: 'Keep refrigerated or in an airtight container in a cool spot for up to 60 days.',
    perfect_for: ['Daily Energy', 'Post Workout', 'Healthy Snacking', 'Kids Nutrition', 'Family Wellness'],
    benefits: [
      'Sustained Natural Energy without sugar crashes',
      'High in dietary fiber for optimal digestive wellness',
      'Zero refined white sugar or artificial additives',
      'Rich in healthy omega-3 and vital plant-based fats',
      'Packed with natural magnesium, iron, and potassium'
    ],
    variants: [
      {
        id: 'd0000000-0000-0000-0000-000000000001',
        product_id: 'c0000000-0000-0000-0000-000000000001',
        weight: '250g',
        regular_price: 2199,
        sale_price: 1999,
        price_per_100g: 799.6,
        stock: 85,
        is_default: true,
        active: true,
        sort_order: 1
      },
      {
        id: 'd0000000-0000-0000-0000-000000000002',
        product_id: 'c0000000-0000-0000-0000-000000000001',
        weight: '500g',
        regular_price: 3899,
        sale_price: 3899,
        price_per_100g: 779.8,
        stock: 45,
        is_default: false,
        active: true,
        sort_order: 2
      }
    ],
    ingredients: [
      { id: '1', name: 'Dates', slug: 'dates', image_url: '/assets/ingredients/dates.png' },
      { id: '2', name: 'Almonds', slug: 'almonds', image_url: '/assets/ingredients/almonds.png' },
      { id: '3', name: 'Walnuts', slug: 'walnuts', image_url: '/assets/ingredients/walnuts.png' },
      { id: '4', name: 'Cashews', slug: 'cashews', image_url: '/assets/ingredients/cashews.png' },
      { id: '5', name: 'Raisins', slug: 'raisins', image_url: '/assets/ingredients/raisins.png' },
      { id: '6', name: 'Figs', slug: 'figs', image_url: '/assets/ingredients/figs.png' },
      { id: '7', name: 'Coconut', slug: 'coconut', image_url: '/assets/ingredients/coconut.png' },
      { id: '8', name: 'Desi Ghee', slug: 'desi-ghee', image_url: '/assets/ingredients/desi_ghee.png' },
      { id: '9', name: 'Cardamom', slug: 'cardamom', image_url: '/assets/ingredients/cardamom.png' },
      { id: '10', name: 'Lotus Seeds', slug: 'lotus-seeds', image_url: '/assets/ingredients/lotus_seeds.png' },
      { id: '11', name: 'Pumpkin Seeds', slug: 'pumpkin-seeds', image_url: '/assets/ingredients/pumpkin_seeds.png' },
      { id: '12', name: 'Sunflower Seeds', slug: 'sunflower-seeds', image_url: '/assets/ingredients/sunflower_seeds.png' },
      { id: '13', name: 'White Sesame Seeds', slug: 'white-sesame-seeds', image_url: '/assets/ingredients/white_sesame_seeds.png' }
    ],
    nutrition_facts: [
      { id: '1', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Energy', value: 550, unit: 'kcal', per_amount: '100g', sort_order: 1 },
      { id: '2', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Healthy Fats', value: 35, unit: 'g', per_amount: '100g', sort_order: 2 },
      { id: '3', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Protein', value: 15, unit: 'g', per_amount: '100g', sort_order: 3 },
      { id: '4', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Carbohydrates', value: 40, unit: 'g', per_amount: '100g', sort_order: 4 },
      { id: '5', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Dietary Fiber', value: 9.8, unit: 'g', per_amount: '100g', sort_order: 5 },
      { id: '6', product_id: 'c0000000-0000-0000-0000-000000000001', label: 'Natural Sugar', value: 25, unit: 'g', per_amount: '100g', sort_order: 6 }
    ]
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    name: 'Homemade Panjeeri',
    slug: 'homemade-panjeeri',
    tagline: 'Traditional Family Recipe • Tradition in Every Bite',
    short_description: 'Traditional family recipe made with pure desi ghee, healthy fats, protein and essential nutrients.',
    description: 'Prepared with pure grassroots churned desi ghee and the finest selection of roasted almonds, walnuts, cashews, makhana (lotus seeds), char magaz seeds, and golden semolina. A wholesome, deeply nourishing traditional superfood.',
    category: 'panjeeri',
    featured_image: '/assets/products/panjeeri_detail_hero.jpg',
    rating: 4.9,
    review_count: 62,
    badge_label: 'Customer Favorite',
    is_featured: true,
    active: true,
    sort_order: 2,
    storage_instructions: 'Store at room temperature in an airtight jar. Best consumed within 90 days.',
    perfect_for: ['Joint Health', 'Postpartum Recovery', 'Winter Warmth', 'Breakfast Boost', 'Elderly Nutrition'],
    benefits: [
      'Strengthens joints and back muscles with traditional nutrients',
      'Accelerates postpartum healing and lactation support',
      'Provides rich natural protein and wholesome healthy fats',
      'Warms the body during winters and rainy seasons',
      'Made purely with 100% genuine Pakistani Desi Ghee'
    ],
    variants: [
      {
        id: 'd0000000-0000-0000-0000-000000000003',
        product_id: 'c0000000-0000-0000-0000-000000000002',
        weight: '250g',
        regular_price: 1648,
        sale_price: 1499,
        price_per_100g: 599.6,
        stock: 90,
        is_default: true,
        active: true,
        sort_order: 1
      },
      {
        id: 'd0000000-0000-0000-0000-000000000004',
        product_id: 'c0000000-0000-0000-0000-000000000002',
        weight: '500g',
        regular_price: 2899,
        sale_price: 2899,
        price_per_100g: 579.8,
        stock: 60,
        is_default: false,
        active: true,
        sort_order: 2
      }
    ],
    ingredients: [
      { id: '2', name: 'Almonds', slug: 'almonds', image_url: '/assets/ingredients/almonds.png' },
      { id: '3', name: 'Walnuts', slug: 'walnuts', image_url: '/assets/ingredients/walnuts.png' },
      { id: '4', name: 'Cashews', slug: 'cashews', image_url: '/assets/ingredients/cashews.png' },
      { id: '5', name: 'Raisins', slug: 'raisins', image_url: '/assets/ingredients/raisins.png' },
      { id: '1', name: 'Dry Dates', slug: 'dry-dates', image_url: '/assets/ingredients/dates.png' },
      { id: '9', name: 'Cardamom', slug: 'cardamom', image_url: '/assets/ingredients/cardamom.png' },
      { id: '7', name: 'Coconut', slug: 'coconut', image_url: '/assets/ingredients/coconut.png' },
      { id: '14', name: 'Semolina (Suji)', slug: 'semolina', image_url: '/assets/ingredients/semolina_suji.png' },
      { id: '8', name: 'Pure Desi Ghee', slug: 'desi-ghee', image_url: '/assets/ingredients/desi_ghee.png' },
      { id: '10', name: 'Lotus Seeds (Makhana)', slug: 'lotus-seeds', image_url: '/assets/ingredients/lotus_seeds.png' },
      { id: '11', name: 'Pumpkin Seeds', slug: 'pumpkin-seeds', image_url: '/assets/ingredients/pumpkin_seeds.png' },
      { id: '12', name: 'Sunflower Seeds', slug: 'sunflower-seeds', image_url: '/assets/ingredients/sunflower_seeds.png' }
    ],
    nutrition_facts: [
      { id: '7', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Energy', value: 520, unit: 'kcal', per_amount: '100g', sort_order: 1 },
      { id: '8', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Healthy Fats', value: 32, unit: 'g', per_amount: '100g', sort_order: 2 },
      { id: '9', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Protein', value: 13.5, unit: 'g', per_amount: '100g', sort_order: 3 },
      { id: '10', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Carbohydrates', value: 44, unit: 'g', per_amount: '100g', sort_order: 4 },
      { id: '11', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Dietary Fiber', value: 8.2, unit: 'g', per_amount: '100g', sort_order: 5 },
      { id: '12', product_id: 'c0000000-0000-0000-0000-000000000002', label: 'Natural Sugar', value: 18, unit: 'g', per_amount: '100g', sort_order: 6 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'h0000000-0000-0000-0000-000000000001',
    order_number: 'NS-1001',
    customer_name: 'Hira Malik',
    customer_phone: '+92 301 2345678',
    delivery_city: 'Sargodha',
    delivery_address: 'House 42, Block 14, Satellite Town, Sargodha',
    is_gift: false,
    payment_method_code: 'jazzcash',
    delivery_method_code: 'sargodha_sameday',
    status: 'delivered',
    subtotal: 2710,
    delivery_fee: 150,
    discount: 0,
    total: 2860,
    created_at: '2025-05-28T14:30:00Z',
    items: [
      {
        id: 'i1',
        order_id: 'h0000000-0000-0000-0000-000000000001',
        product_id: 'c0000000-0000-0000-0000-000000000001',
        variant_id: 'd0000000-0000-0000-0000-000000000002',
        product_name: 'Date & Nuts Balls',
        variant_weight: '500g',
        unit_price: 2710,
        quantity: 1,
        total_price: 2710,
        product_image: '/assets/products/energy_balls_card.jpg'
      }
    ]
  },
  {
    id: 'h0000000-0000-0000-0000-000000000002',
    order_number: 'NS-1002',
    customer_name: 'Umeera Ali',
    customer_phone: '+92 321 9876543',
    delivery_city: 'Lahore',
    delivery_address: 'House 112, Street 7, DHA Phase 5, Lahore',
    is_gift: false,
    payment_method_code: 'easypaisa',
    delivery_method_code: 'tcs_nationwide',
    status: 'out_for_delivery',
    subtotal: 1200,
    delivery_fee: 250,
    discount: 0,
    total: 1450,
    created_at: '2025-05-29T10:15:00Z',
    items: [
      {
        id: 'i2',
        order_id: 'h0000000-0000-0000-0000-000000000002',
        product_id: 'c0000000-0000-0000-0000-000000000002',
        variant_id: 'd0000000-0000-0000-0000-000000000003',
        product_name: 'Homemade Panjeeri',
        variant_weight: '250g',
        unit_price: 1200,
        quantity: 1,
        total_price: 1200,
        product_image: '/assets/products/panjeeri_card.jpg'
      }
    ]
  },
  {
    id: 'h0000000-0000-0000-0000-000000000003',
    order_number: 'NS-1003',
    customer_name: 'Ayesha Khan',
    customer_phone: '+92 333 4567890',
    delivery_city: 'Sargodha',
    delivery_address: 'Street 3, Gulshan-e-Iqbal, Sargodha',
    is_gift: false,
    payment_method_code: 'bank_transfer',
    delivery_method_code: 'foodpanda_sargodha',
    status: 'confirmed',
    subtotal: 1280,
    delivery_fee: 120,
    discount: 0,
    total: 1400,
    created_at: '2025-05-30T11:45:00Z',
    items: [
      {
        id: 'i3',
        order_id: 'h0000000-0000-0000-0000-000000000003',
        product_id: 'c0000000-0000-0000-0000-000000000001',
        variant_id: 'd0000000-0000-0000-0000-000000000002',
        product_name: 'Date & Nuts Balls',
        variant_weight: '500g',
        unit_price: 1280,
        quantity: 1,
        total_price: 1280,
        product_image: '/assets/products/energy_balls_card.jpg'
      }
    ]
  },
  {
    id: 'h0000000-0000-0000-0000-000000000004',
    order_number: 'NS-1004',
    customer_name: 'Bilal Ahmed',
    customer_phone: '+92 300 7654321',
    delivery_city: 'Sargodha',
    delivery_address: 'Main University Road, Sargodha',
    is_gift: false,
    payment_method_code: 'jazzcash',
    delivery_method_code: 'self_pickup',
    status: 'preparing',
    subtotal: 2800,
    delivery_fee: 0,
    discount: 0,
    total: 2800,
    created_at: '2025-05-30T16:20:00Z',
    items: [
      {
        id: 'i4',
        order_id: 'h0000000-0000-0000-0000-000000000004',
        product_id: 'c0000000-0000-0000-0000-000000000002',
        variant_id: 'd0000000-0000-0000-0000-000000000004',
        product_name: 'Homemade Panjeeri',
        variant_weight: '500g',
        unit_price: 2800,
        quantity: 1,
        total_price: 2800,
        product_image: '/assets/products/panjeeri_card.jpg'
      }
    ]
  },
  {
    id: 'h0000000-0000-0000-0000-000000000005',
    order_number: 'NS-1005',
    customer_name: 'Sana Iqbal',
    customer_phone: '+92 345 1122334',
    delivery_city: 'Islamabad',
    delivery_address: 'Apartment 4B, F-11 Markaz, Islamabad',
    is_gift: true,
    gift_message: 'Happy Birthday Mother! From Sana',
    payment_method_code: 'easypaisa',
    delivery_method_code: 'tcs_nationwide',
    status: 'pending',
    subtotal: 1200,
    delivery_fee: 250,
    discount: 0,
    total: 1450,
    created_at: '2025-05-31T09:10:00Z',
    items: [
      {
        id: 'i5',
        order_id: 'h0000000-0000-0000-0000-000000000005',
        product_id: 'c0000000-0000-0000-0000-000000000001',
        variant_id: 'd0000000-0000-0000-0000-000000000001',
        product_name: 'Date & Nuts Balls',
        variant_weight: '250g',
        unit_price: 1200,
        quantity: 1,
        total_price: 1200,
        product_image: '/assets/products/energy_balls_card.jpg'
      }
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'j1',
    customer_name: 'Misbah',
    customer_avatar: '/assets/avatars/avatar_misbah.png',
    location: 'Pakistan',
    rating: 5,
    comment: 'Bht acha ha! JazakAllah mam ❤️ Truly authentic taste, the nuts are crunchy and fresh.',
    product_name: 'Homemade Panjeeri',
    whatsapp_quote: 'Bht acha ha!\nJazakAllah mam ❤️ 7:24 PM',
    screenshot_url: '/assets/avatars/review_whatsapp_bubble.png',
    verified: true,
    helpful_count: 18,
    status: 'approved',
    is_featured: true,
    review_date: '2 weeks ago'
  },
  {
    id: 'j2',
    customer_name: 'Rakshanda',
    customer_avatar: '/assets/avatars/avatar_rakshanda.png',
    location: 'Pakistan',
    rating: 5,
    comment: 'Absolutely love the taste, presentation and most importantly the hygienic homemade quality. Highly recommended!',
    product_name: 'Date & Nuts Energy Balls',
    verified: true,
    helpful_count: 24,
    status: 'approved',
    is_featured: true,
    review_date: '1 month ago'
  },
  {
    id: 'j3',
    customer_name: 'ShahJehan',
    customer_avatar: '/assets/avatars/avatar_shahjehan.png',
    location: 'Pakistan',
    rating: 5,
    comment: 'Panjeeri bohat hi mazedar thi and the complimentary ladoos were such a lovely surprise. Fresh, healthy and truly homemade. Highly recommended!',
    product_name: 'Homemade Panjeeri & Ladoos',
    verified: true,
    helpful_count: 41,
    status: 'approved',
    is_featured: true,
    review_date: '3 months ago'
  },
  {
    id: 'j4',
    customer_name: 'Ayesha Noor',
    location: 'Lahore, Pakistan',
    rating: 5,
    comment: 'Amazing taste and very fresh! The energy balls are perfect for a healthy snack. Highly recommended!',
    product_name: 'Date & Nuts Energy Balls',
    verified: true,
    helpful_count: 12,
    status: 'approved',
    is_featured: true,
    review_date: '12 May 2025'
  },
  {
    id: 'j5',
    customer_name: 'Hassan Raza',
    location: 'Islamabad, Pakistan',
    rating: 5,
    comment: 'Panjeeri tastes just like homemade. You can feel the quality of ingredients. Will order again!',
    product_name: 'Homemade Panjeeri',
    verified: true,
    helpful_count: 8,
    status: 'approved',
    is_featured: true,
    review_date: '6 May 2025'
  },
  {
    id: 'j6',
    customer_name: 'Zainab Fatima',
    location: 'Karachi, Pakistan',
    rating: 5,
    comment: 'Beautiful packaging and excellent service. Truly crafted with love!',
    product_name: 'Date & Nuts Energy Balls',
    verified: true,
    helpful_count: 15,
    status: 'approved',
    is_featured: true,
    review_date: '2 May 2025'
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'k1',
    category: 'General',
    question: 'What is Nourish Spoon?',
    answer: 'Nourish Spoon is a home-grown brand offering premium Panjeeri, Date & Nut Energy Balls and healthy traditional recipes made with pure, natural ingredients — crafted with love for your family’s well-being.',
    sort_order: 1,
    active: true
  },
  {
    id: 'k2',
    category: 'Products',
    question: 'Are your products 100% natural?',
    answer: 'Yes! We only use 100% natural ingredients like premium dates, dry fruits, desi ghee, and pure seeds. We never add refined white sugar, preservatives, artificial essences, or fillers.',
    sort_order: 2,
    active: true
  },
  {
    id: 'k3',
    category: 'Ordering',
    question: 'How do I place an order?',
    answer: 'Simply select your desired product and size, tap "Order on WhatsApp", fill in your address, and send the prefilled WhatsApp message to our team (+92 304 6721962). We will promptly confirm your order.',
    sort_order: 3,
    active: true
  },
  {
    id: 'k4',
    category: 'Delivery',
    question: 'What payment methods do you accept?',
    answer: 'We accept advance payments through Bank Transfer (Meezan Bank), EasyPaisa, and JazzCash. Cash on delivery is not offered to guarantee that every batch is freshly prepared on order.',
    sort_order: 4,
    active: true
  },
  {
    id: 'k5',
    category: 'Delivery',
    question: 'Do you ship across Pakistan?',
    answer: 'Yes, we provide same-day local doorstep delivery in Sargodha and reliable nationwide delivery across all major cities of Pakistan via TCS (2–3 business days).',
    sort_order: 5,
    active: true
  },
  {
    id: 'k6',
    category: 'Gifting',
    question: 'Do you offer gift packaging?',
    answer: 'Yes! We provide custom festive gift packaging with airtight safety seals and handwritten personalized gift cards for Eid, weddings, baby showers, or loved ones.',
    sort_order: 6,
    active: true
  }
];

export const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'f1',
    code: 'bank_transfer',
    name: 'Bank Transfer',
    subtext: 'Direct bank transfer to our official account. Secure and easy.',
    account_title: 'Nourish Spoon Kitchen',
    account_number: '01020304050607',
    bank_name: 'Meezan Bank Ltd',
    iban: 'PK45MEZN0001020304050607',
    instructions: 'Please share the transaction receipt or screenshot on WhatsApp after transferring.',
    icon: '/assets/icons/icon_bank.png',
    active: true,
    advance_only: true,
    sort_order: 1
  },
  {
    id: 'f2',
    code: 'easypaisa',
    name: 'EasyPaisa',
    subtext: 'Quick and secure payment via EasyPaisa mobile wallet.',
    account_title: 'Tayyaba - Nourish Spoon',
    account_number: '03046721962',
    bank_name: 'EasyPaisa / Telenor Microfinance',
    instructions: 'Send payment to 0304-6721962 and send screenshot on WhatsApp.',
    icon: '/assets/icons/icon_easypaisa.png',
    active: true,
    advance_only: true,
    sort_order: 2
  },
  {
    id: 'f3',
    code: 'jazzcash',
    name: 'JazzCash',
    subtext: 'Pay easily through JazzCash mobile wallet.',
    account_title: 'Tayyaba - Nourish Spoon',
    account_number: '03046721962',
    bank_name: 'Mobilink Microfinance Bank',
    instructions: 'Send payment to 0304-6721962 and send screenshot on WhatsApp.',
    icon: '/assets/icons/icon_jazzcash.png',
    active: true,
    advance_only: true,
    sort_order: 3
  }
];

export const INITIAL_DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'g1',
    code: 'sargodha_sameday',
    title: 'Same-day delivery in Sargodha',
    subtitle: 'Freshly made and delivered to your doorstep on the same day.',
    description: 'Orders placed before 5 PM are freshly packed and delivered to your home on the very same day in Sargodha city.',
    estimated_time: 'Same Day (under 4 hours)',
    fee: 150,
    available_cities: ['Sargodha'],
    icon: '/assets/icons/icon_delivery_sargodha.png',
    active: true,
    sort_order: 1
  },
  {
    id: 'g2',
    code: 'tcs_nationwide',
    title: 'Nationwide delivery via TCS',
    subtitle: '2–3 working days across Pakistan. Safe and reliable delivery.',
    description: 'Carefully packed in airtight jars with bubble wrapping to reach Lahore, Karachi, Islamabad, Peshawar and all cities nationwide.',
    estimated_time: '2-3 Working Days',
    fee: 250,
    available_cities: ['All Pakistan', 'Lahore', 'Islamabad', 'Karachi', 'Faisalabad', 'Rawalpindi', 'Multan'],
    icon: '/assets/icons/icon_delivery_tcs.png',
    active: true,
    sort_order: 2
  },
  {
    id: 'g3',
    code: 'foodpanda_sargodha',
    title: 'Foodpanda in Sargodha',
    subtitle: 'Order through Foodpanda for quick delivery in Sargodha.',
    description: 'Fast doorstep delivery for urgent cravings and same-hour tea time snacks in Sargodha.',
    estimated_time: '30-45 Minutes',
    fee: 120,
    available_cities: ['Sargodha'],
    icon: '/assets/icons/icon_delivery_foodpanda.png',
    active: true,
    sort_order: 3
  },
  {
    id: 'g4',
    code: 'self_pickup',
    title: 'Self Pickup (Sargodha)',
    subtitle: 'Collect your order from our kitchen in Sargodha at your convenience.',
    description: 'Pick up your fresh warm jar directly from our kitchen in Sargodha at no extra delivery fee.',
    estimated_time: 'Ready in 2 hours',
    fee: 0,
    available_cities: ['Sargodha'],
    icon: '/assets/icons/icon_delivery_pickup.png',
    active: true,
    sort_order: 4
  }
];

export const BRAND_IDENTITY: BrandIdentity = {
  name: 'Nourish Spoon',
  tagline: 'Crafted with Love',
  founder: 'Tayyaba',
  city: 'Sargodha',
  province: 'Punjab',
  country: 'Pakistan',
  address: 'Sargodha, Punjab, Pakistan',
  whatsapp_phone: '+92 304 6721962',
  display_phone: '+92 304 6721962',
  email: 'info@nourishspoon.com',
  business_hours: 'Monday – Saturday, 8am – 11pm',
  instagram: '@nourishspoon',
  same_day_delivery_headline: 'Same-day delivery in Sargodha',
  same_day_delivery_subtext: 'Freshly made • Direct to your doorstep'
};

export const FOUNDER_STORY: FounderStory = {
  founder_name: 'Tayyaba',
  title: 'Founder, Nourish Spoon',
  location: 'Sargodha, Pakistan',
  quote: 'We make every jar as if it’s going to our own family.',
  story_heading: 'A Story of Family, Food & Purpose',
  story_body: 'Nourish Spoon was born from recipes passed down from my mother and grandmother — timeless traditions made with real, natural ingredients. What started in our home kitchen in Sargodha has grown into a mission to share the same warmth, nourishment and goodness with families across Pakistan. Every jar carries a piece of our family’s love, crafted for yours.',
  process: [
    { step: 1, title: 'Source Premium Ingredients', desc: 'We carefully select the finest nuts, dates and natural ingredients.' },
    { step: 2, title: 'Prepare Fresh', desc: 'Our traditional family recipes are prepared in small batches for the best taste.' },
    { step: 3, title: 'Pack Airtight', desc: 'Hygienically packed to lock in freshness and natural nutrition.' },
    { step: 4, title: 'Deliver to You', desc: 'Freshly made and delivered direct to your doorstep across Pakistan.' }
  ],
  values: [
    { title: 'Quality First', desc: 'Only the best ingredients make it to our jars.' },
    { title: 'Honest Nutrition', desc: 'Real ingredients. No shortcuts. No refined sugar.' },
    { title: 'Made with Love', desc: 'Crafted with care, just like our family recipes.' },
    { title: 'Natural Always', desc: '100% natural, wholesome ingredients.' },
    { title: 'Transparent', desc: 'We believe in honesty, from our kitchen to your home.' }
  ]
};
