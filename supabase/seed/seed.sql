-- ==============================================================================
-- NOURISH SPOON: SUPABASE SEED DATA
-- Description: Complete seed data matching HD Designs and PRD Requirements
-- ==============================================================================

-- 1. App Settings & Store Configuration
INSERT INTO app_settings (key, value, description) VALUES
('brand_identity', '{
    "name": "Nourish Spoon",
    "tagline": "Crafted with Love",
    "founder": "Tayyaba",
    "city": "Sargodha",
    "province": "Punjab",
    "country": "Pakistan",
    "address": "Sargodha, Punjab, Pakistan",
    "whatsapp_phone": "+92 304 6721962",
    "display_phone": "+92 304 6721962",
    "email": "info@nourishspoon.com",
    "business_hours": "Monday – Saturday, 8am – 11pm",
    "instagram": "@nourishspoon",
    "same_day_delivery_headline": "Same-day delivery in Sargodha",
    "same_day_delivery_subtext": "Freshly made • Direct to your doorstep"
}'::jsonb, 'Global brand and contact metadata'),

('feature_flags', '{
    "native_cart_enabled": false,
    "online_gateway_enabled": false,
    "whatsapp_ordering_primary": true,
    "reviews_submission_enabled": true,
    "dark_mode_supported": true
}'::jsonb, 'Operational feature toggles'),

('theme_tokens', '{
    "light": {
        "primary": "#0D5428",
        "primaryDark": "#073B21",
        "background": "#FFF9EC",
        "surface": "#FFFFFF",
        "card": "#FFFFFF",
        "gold": "#C99B36",
        "text": "#10271A",
        "mutedText": "#5A6D60",
        "border": "#E8DFC8"
    },
    "dark": {
        "primary": "#77A76A",
        "primaryDark": "#0C1B12",
        "background": "#0C1B12",
        "surface": "#14291C",
        "card": "#183223",
        "gold": "#D4AA52",
        "text": "#F7F1E5",
        "mutedText": "#9BB2A4",
        "border": "#24422F"
    }
}'::jsonb, 'Design system color tokens'),

('founder_story', '{
    "founder_name": "Tayyaba",
    "title": "Founder, Nourish Spoon",
    "location": "Sargodha, Pakistan",
    "quote": "We make every jar as if it’s going to our own family.",
    "story_heading": "A Story of Family, Food & Purpose",
    "story_body": "Nourish Spoon was born from recipes passed down from my mother and grandmother — timeless traditions made with real, natural ingredients. What started in our home kitchen in Sargodha has grown into a mission to share the same warmth, nourishment and goodness with families across Pakistan. Every jar carries a piece of our family’s love, crafted for yours.",
    "process": [
        {"step": 1, "title": "Source Premium Ingredients", "desc": "We carefully select the finest nuts, dates and natural ingredients."},
        {"step": 2, "title": "Prepare Fresh", "desc": "Our traditional family recipes are prepared in small batches for the best taste."},
        {"step": 3, "title": "Pack Airtight", "desc": "Hygienically packed to lock in freshness and natural nutrition."},
        {"step": 4, "title": "Deliver to You", "desc": "Freshly made and delivered direct to your doorstep across Pakistan."}
    ],
    "values": [
        {"title": "Quality First", "desc": "Only the best ingredients make it to our jars."},
        {"title": "Honest Nutrition", "desc": "Real ingredients. No shortcuts. No refined sugar."},
        {"title": "Made with Love", "desc": "Crafted with care, just like our family recipes."},
        {"title": "Natural Always", "desc": "100% natural, wholesome ingredients."},
        {"title": "Transparent", "desc": "We believe in honesty, from our kitchen to your home."}
    ]
}'::jsonb, 'Founder Story and Brand Values')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Staff & Admins
INSERT INTO admins (id, full_name, email, role, active) VALUES
('a0000000-0000-0000-0000-000000000001', 'Tayyaba', 'tayyaba@nourishspoon.com', 'super_admin', true),
('a0000000-0000-0000-0000-000000000002', 'Areeba Khan', 'areeba@nourishspoon.com', 'admin', true),
('a0000000-0000-0000-0000-000000000003', 'Hamza Tariq', 'hamza@nourishspoon.com', 'order_manager', true),
('a0000000-0000-0000-0000-000000000004', 'Fatima Zahra', 'fatima@nourishspoon.com', 'content_manager', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Ingredients Catalog (14 Natural Ingredients)
INSERT INTO ingredients (id, name, slug, category, image_url, description) VALUES
('b0000000-0000-0000-0000-000000000001', 'Dates', 'dates', 'dry_fruits', '/assets/ingredients/dates.png', 'Natural sweetness and mineral rich Arabian and Pakistani dates.'),
('b0000000-0000-0000-0000-000000000002', 'Almonds', 'almonds', 'nuts', '/assets/ingredients/almonds.png', 'Crisp, premium Californian and local Pakistani almonds.'),
('b0000000-0000-0000-0000-000000000003', 'Walnuts', 'walnuts', 'nuts', '/assets/ingredients/walnuts.png', 'Brain boosting omega-3 rich Kashmiri walnuts.'),
('b0000000-0000-0000-0000-000000000004', 'Cashews', 'cashews', 'nuts', '/assets/ingredients/cashews.png', 'Buttery smooth, nutrient dense roasted cashews.'),
('b0000000-0000-0000-0000-000000000005', 'Raisins', 'raisins', 'dry_fruits', '/assets/ingredients/raisins.png', 'Sun-dried golden sweet raisins packed with antioxidants.'),
('b0000000-0000-0000-0000-000000000006', 'Figs', 'figs', 'dry_fruits', '/assets/ingredients/figs.png', 'High-fiber dried Afghan figs with delicate natural seeds.'),
('b0000000-0000-0000-0000-000000000007', 'Coconut', 'coconut', 'fats', '/assets/ingredients/coconut.png', 'Pure grated coconut flakes offering clean medium-chain fats.'),
('b0000000-0000-0000-0000-000000000008', 'Desi Ghee', 'desi-ghee', 'fats', '/assets/ingredients/desi_ghee.png', '100% pure grassroots churned grass-fed desi butter ghee.'),
('b0000000-0000-0000-0000-000000000009', 'Cardamom', 'cardamom', 'spices', '/assets/ingredients/cardamom.png', 'Aromatic fragrant green cardamom pods ground fresh.'),
('b0000000-0000-0000-0000-000000000010', 'Lotus Seeds (Makhana)', 'lotus-seeds', 'seeds', '/assets/ingredients/lotus_seeds.png', 'Puffed lotus seeds known for restorative wellness properties.'),
('b0000000-0000-0000-0000-000000000011', 'Pumpkin Seeds', 'pumpkin-seeds', 'seeds', '/assets/ingredients/pumpkin_seeds.png', 'Zinc and magnesium rich roasted organic pumpkin seeds.'),
('b0000000-0000-0000-0000-000000000012', 'Sunflower Seeds', 'sunflower-seeds', 'seeds', '/assets/ingredients/sunflower_seeds.png', 'Vitamin E and heart-healthy seed kernels.'),
('b0000000-0000-0000-0000-000000000013', 'White Sesame Seeds', 'white-sesame-seeds', 'seeds', '/assets/ingredients/white_sesame_seeds.png', 'Calcium rich lightly toasted white til sesame seeds.'),
('b0000000-0000-0000-0000-000000000014', 'Semolina (Suji)', 'semolina', 'grains', '/assets/ingredients/semolina_suji.png', 'Slow-roasted golden semolina for traditional panjeeri texture.')
ON CONFLICT (id) DO NOTHING;

-- 4. Products Catalog
INSERT INTO products (id, name, slug, tagline, short_description, description, category, featured_image, rating, review_count, badge_label, benefits, storage_instructions, is_featured, active, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 
 'Date & Nuts Energy Balls', 
 'date-and-nuts-energy-balls', 
 'Naturally Sweetened • Pure Ingredients • No Refined Sugar',
 'Naturally sweetened, nutrient-dense and packed with wholesome ingredients. No refined sugar.',
 'Our signature Date & Nuts Energy Balls are handcrafted with handpicked Arabian dates, crunchy almonds, walnuts, cashews, figs, and toasted seeds. Slow rolled in small batches with a touch of pure desi ghee and fragrant cardamom. They offer long-lasting sustained energy without sugar crashes.',
 'energy_balls',
 '/assets/products/energy_balls_detail_hero.jpg',
 4.90,
 48,
 'Best Seller',
 '["Sustained Natural Energy", "High in Dietary Fiber", "Zero Refined White Sugar", "Rich in Healthy Omega Fats", "Immunity & Brain Support"]'::jsonb,
 'Keep refrigerated or in an airtight container in a cool spot for up to 60 days.',
 true,
 true,
 1),

('c0000000-0000-0000-0000-000000000002', 
 'Homemade Panjeeri', 
 'homemade-panjeeri', 
 'Traditional Family Recipe • Tradition in Every Bite',
 'Traditional family recipe made with pure desi ghee, healthy fats, protein and essential nutrients.',
 'Prepared with pure desi ghee and the finest selection of roasted almonds, walnuts, cashews, makhana (lotus seeds), char magaz seeds, and roasted semolina. A wholesome, deeply nourishing traditional superfood for joint strength, postpartum recovery, and daily vitality.',
 'panjeeri',
 '/assets/products/panjeeri_detail_hero.jpg',
 4.90,
 62,
 'Customer Favorite',
 '["Joint & Bone Support", "Postpartum Restoration", "High Protein & Healthy Fats", "Boosts Stamina & Vitality", "100% Pure Desi Ghee"]'::jsonb,
 'Store at room temperature in an airtight jar. Best consumed within 90 days.',
 true,
 true,
 2)
ON CONFLICT (id) DO NOTHING;

-- 5. Product Variants (Exact Pricing from PRD & HD Designs)
INSERT INTO product_variants (id, product_id, weight, regular_price, sale_price, price_per_100g, stock, is_default, active, sort_order) VALUES
-- Energy Balls Variants
('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '250g', 2199.00, 1999.00, 7.996, 85, true, true, 1),
('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', '500g', 3899.00, 3899.00, 7.798, 45, false, true, 2),

-- Homemade Panjeeri Variants
('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', '250g', 1648.00, 1499.00, 5.996, 90, true, true, 1),
('d0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', '500g', 2899.00, 2899.00, 5.798, 60, false, true, 2)
ON CONFLICT (id) DO NOTHING;

-- 6. Product Ingredients Mapping
INSERT INTO product_ingredients (product_id, ingredient_id, sort_order) VALUES
-- Energy Balls Ingredients (13)
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 1), -- Dates
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 2), -- Almonds
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 3), -- Walnuts
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 4), -- Cashews
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 5), -- Raisins
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 6), -- Figs
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 7), -- Coconut
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008', 8), -- Desi Ghee
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 9), -- Cardamom
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 10), -- Lotus Seeds
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 11), -- Pumpkin Seeds
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 12), -- Sunflower Seeds
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000013', 13), -- White Sesame Seeds

-- Panjeeri Ingredients (12)
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 1), -- Almonds
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 2), -- Walnuts
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 3), -- Cashews
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000005', 4), -- Raisins
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 5), -- Dry Dates
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000009', 6), -- Cardamom
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 7), -- Coconut
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000014', 8), -- Semolina (Suji)
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000008', 9), -- Desi Ghee
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000010', 10), -- Lotus Seeds (Makhana)
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000011', 11), -- Pumpkin Seeds
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000012', 12)  -- Sunflower Seeds
ON CONFLICT DO NOTHING;

-- 7. Nutrition Facts (per 100g, from PRD Section 6.7)
INSERT INTO nutrition_facts (id, product_id, label, value, unit, per_amount, sort_order) VALUES
('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Energy', 550.00, 'kcal', '100g', 1),
('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Healthy Fats', 35.00, 'g', '100g', 2),
('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Protein', 15.00, 'g', '100g', 3),
('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Carbohydrates', 40.00, 'g', '100g', 4),
('e0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Dietary Fiber', 9.80, 'g', '100g', 5),
('e0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Natural Sugar', 25.00, 'g', '100g', 6),

('e0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'Energy', 520.00, 'kcal', '100g', 1),
('e0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Healthy Fats', 32.00, 'g', '100g', 2),
('e0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000002', 'Protein', 13.50, 'g', '100g', 3),
('e0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000002', 'Carbohydrates', 44.00, 'g', '100g', 4),
('e0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000002', 'Dietary Fiber', 8.20, 'g', '100g', 5),
('e0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000002', 'Natural Sugar', 18.00, 'g', '100g', 6)
ON CONFLICT (id) DO NOTHING;

-- 8. Payment Methods (From Screen 06)
INSERT INTO payment_methods (id, code, name, subtext, account_title, account_number, bank_name, iban, instructions, icon, active, advance_only, sort_order) VALUES
('f0000000-0000-0000-0000-000000000001', 'bank_transfer', 'Bank Transfer', 'Direct bank transfer to our official account. Secure and easy.', 'Nourish Spoon Kitchen', '01020304050607', 'Meezan Bank Ltd', 'PK45MEZN0001020304050607', 'Please share the transaction receipt or screenshot on WhatsApp after transferring.', '/assets/icons/icon_bank.png', true, true, 1),
('f0000000-0000-0000-0000-000000000002', 'easypaisa', 'EasyPaisa', 'Quick and secure payment via EasyPaisa mobile wallet.', 'Tayyaba - Nourish Spoon', '03046721962', 'EasyPaisa / Telenor Microfinance', NULL, 'Send payment to 0304-6721962 and send screenshot on WhatsApp.', '/assets/icons/icon_easypaisa.png', true, true, 2),
('f0000000-0000-0000-0000-000000000003', 'jazzcash', 'JazzCash', 'Pay easily through JazzCash mobile wallet.', 'Tayyaba - Nourish Spoon', '03046721962', 'Mobilink Microfinance Bank', NULL, 'Send payment to 0304-6721962 and send screenshot on WhatsApp.', '/assets/icons/icon_jazzcash.png', true, true, 3),
('f0000000-0000-0000-0000-000000000004', 'cod', 'Cash on Delivery', 'Cash on Delivery is currently disabled.', 'N/A', 'N/A', NULL, NULL, 'We currently operate exclusively on advance payment to maintain custom fresh small batch preparation.', NULL, false, false, 4)
ON CONFLICT (id) DO NOTHING;

-- 9. Delivery Options (From Screen 06)
INSERT INTO delivery_methods (id, code, title, subtitle, description, estimated_time, fee, available_cities, icon, active, sort_order) VALUES
('g0000000-0000-0000-0000-000000000001', 'sargodha_sameday', 'Same-day delivery in Sargodha', 'Freshly made and delivered to your doorstep on the same day.', 'Orders placed before 5 PM are freshly packed and delivered to your home on the very same day in Sargodha city.', 'Same Day (under 4 hours)', 150.00, '["Sargodha"]'::jsonb, '/assets/icons/icon_delivery_sargodha.png', true, 1),
('g0000000-0000-0000-0000-000000000002', 'tcs_nationwide', 'Nationwide delivery via TCS', '2–3 working days across Pakistan. Safe and reliable delivery.', 'Carefully packed in airtight jars with bubble wrapping to reach Lahore, Karachi, Islamabad, Peshawar and all cities nationwide.', '2-3 Working Days', 250.00, '["All Pakistan", "Lahore", "Islamabad", "Karachi", "Faisalabad", "Rawalpindi", "Multan"]'::jsonb, '/assets/icons/icon_delivery_tcs.png', true, 2),
('g0000000-0000-0000-0000-000000000003', 'foodpanda_sargodha', 'Foodpanda in Sargodha', 'Order through Foodpanda for quick delivery in Sargodha.', 'Fast doorstep delivery for urgent cravings and same-hour tea time snacks in Sargodha.', '30-45 Minutes', 120.00, '["Sargodha"]'::jsonb, '/assets/icons/icon_delivery_foodpanda.png', true, 3),
('g0000000-0000-0000-0000-000000000004', 'self_pickup', 'Self Pickup (Sargodha)', 'Collect your order from our kitchen in Sargodha at your convenience.', 'Pick up your fresh warm jar directly from our kitchen in Sargodha at no extra delivery fee.', 'Ready in 2 hours', 0.00, '["Sargodha"]'::jsonb, '/assets/icons/icon_delivery_pickup.png', true, 4)
ON CONFLICT (id) DO NOTHING;

-- 10. Orders (From Admin Dashboard Screen 11: NS-1001 to NS-1005)
INSERT INTO orders (id, order_number, customer_name, customer_phone, delivery_city, delivery_address, payment_method_id, payment_method_code, delivery_method_id, delivery_method_code, status, subtotal, delivery_fee, total, whatsapp_generated_message, created_at) VALUES
('h0000000-0000-0000-0000-000000000001', 'NS-1001', 'Hira Malik', '+92 301 2345678', 'Sargodha', 'House 42, Block 14, Satellite Town, Sargodha', 'f0000000-0000-0000-0000-000000000003', 'jazzcash', 'g0000000-0000-0000-0000-000000000001', 'sargodha_sameday', 'delivered', 2710.00, 150.00, 2860.00, 'Hello Nourish Spoon, Order NS-1001 for Hira Malik', timezone('utc'::text, now() - INTERVAL '4 hours')),
('h0000000-0000-0000-0000-000000000002', 'NS-1002', 'Umeera Ali', '+92 321 9876543', 'Lahore', 'House 112, Street 7, DHA Phase 5, Lahore', 'f0000000-0000-0000-0000-000000000002', 'easypaisa', 'g0000000-0000-0000-0000-000000000002', 'tcs_nationwide', 'out_for_delivery', 1200.00, 250.00, 1450.00, 'Hello Nourish Spoon, Order NS-1002 for Umeera Ali', timezone('utc'::text, now() - INTERVAL '8 hours')),
('h0000000-0000-0000-0000-000000000003', 'NS-1003', 'Ayesha Khan', '+92 333 4567890', 'Sargodha', 'Street 3, Gulshan-e-Iqbal, Sargodha', 'f0000000-0000-0000-0000-000000000001', 'bank_transfer', 'g0000000-0000-0000-0000-000000000003', 'foodpanda_sargodha', 'confirmed', 1280.00, 120.00, 1400.00, 'Hello Nourish Spoon, Order NS-1003 for Ayesha Khan', timezone('utc'::text, now() - INTERVAL '1 day')),
('h0000000-0000-0000-0000-000000000004', 'NS-1004', 'Bilal Ahmed', '+92 300 7654321', 'Sargodha', 'Main University Road, Sargodha', 'f0000000-0000-0000-0000-000000000003', 'jazzcash', 'g0000000-0000-0000-0000-000000000004', 'self_pickup', 'preparing', 2800.00, 0.00, 2800.00, 'Hello Nourish Spoon, Order NS-1004 for Bilal Ahmed', timezone('utc'::text, now() - INTERVAL '1 day 4 hours')),
('h0000000-0000-0000-0000-000000000005', 'NS-1005', 'Sana Iqbal', '+92 345 1122334', 'Islamabad', 'Apartment 4B, F-11 Markaz, Islamabad', 'f0000000-0000-0000-0000-000000000002', 'easypaisa', 'g0000000-0000-0000-0000-000000000002', 'tcs_nationwide', 'pending', 1200.00, 250.00, 1450.00, 'Hello Nourish Spoon, Order NS-1005 for Sana Iqbal', timezone('utc'::text, now() - INTERVAL '2 days'))
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, variant_weight, unit_price, quantity, total_price, product_image) VALUES
('i0000000-0000-0000-0000-000000000001', 'h0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Date & Nuts Balls', '500g', 2710.00, 1, 2710.00, '/assets/products/energy_balls_card.jpg'),
('i0000000-0000-0000-0000-000000000002', 'h0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Homemade Panjeeri', '250g', 1200.00, 1, 1200.00, '/assets/products/panjeeri_card.jpg'),
('i0000000-0000-0000-0000-000000000003', 'h0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Date & Nuts Balls', '500g', 1280.00, 1, 1280.00, '/assets/products/energy_balls_card.jpg'),
('i0000000-0000-0000-0000-000000000004', 'h0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000004', 'Homemade Panjeeri', '500g', 2800.00, 1, 2800.00, '/assets/products/panjeeri_card.jpg'),
('i0000000-0000-0000-0000-000000000005', 'h0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Date & Nuts Balls', '250g', 1200.00, 1, 1200.00, '/assets/products/energy_balls_card.jpg')
ON CONFLICT (id) DO NOTHING;

-- 11. Customer Reviews (Screens 07 & 11)
INSERT INTO reviews (id, product_id, customer_name, customer_avatar, location, rating, comment, product_name, whatsapp_quote, screenshot_url, verified, helpful_count, status, is_featured, review_date) VALUES
('j0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Misbah', '/assets/avatars/avatar_misbah.png', 'Pakistan', 5, 'Bht acha ha! JazakAllah mam ❤️ Truly authentic taste, the nuts are crunchy and fresh.', 'Homemade Panjeeri', 'Bht acha ha! JazakAllah mam ❤️ 7:24 PM', '/assets/avatars/review_whatsapp_bubble.png', true, 18, 'approved', true, timezone('utc'::text, now() - INTERVAL '14 days')),
('j0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Rakshanda', '/assets/avatars/avatar_rakshanda.png', 'Pakistan', 5, 'Absolutely love the taste, presentation and most importantly the hygienic homemade quality. Highly recommended!', 'Date & Nuts Energy Balls', NULL, NULL, true, 24, 'approved', true, timezone('utc'::text, now() - INTERVAL '30 days')),
('j0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'ShahJehan', '/assets/avatars/avatar_shahjehan.png', 'Pakistan', 5, 'Panjeeri bohat hi mazedar thi and the complimentary ladoos were such a lovely surprise. Fresh, healthy and truly homemade. Highly recommended!', 'Homemade Panjeeri & Ladoos', NULL, NULL, true, 41, 'approved', true, timezone('utc'::text, now() - INTERVAL '90 days')),
('j0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Ayesha Noor', NULL, 'Lahore, Pakistan', 5, 'Amazing taste and very fresh! The energy balls are perfect for a healthy snack. Highly recommended!', 'Date & Nuts Energy Balls', NULL, NULL, true, 12, 'approved', true, timezone('utc'::text, now() - INTERVAL '12 days')),
('j0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Hassan Raza', NULL, 'Islamabad, Pakistan', 5, 'Panjeeri tastes just like homemade. You can feel the quality of ingredients. Will order again!', 'Homemade Panjeeri', NULL, NULL, true, 8, 'approved', true, timezone('utc'::text, now() - INTERVAL '18 days')),
('j0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Zainab Fatima', NULL, 'Karachi, Pakistan', 5, 'Beautiful packaging and excellent service. Truly crafted with love!', 'Date & Nuts Energy Balls', NULL, NULL, true, 15, 'approved', true, timezone('utc'::text, now() - INTERVAL '22 days'))
ON CONFLICT (id) DO NOTHING;

-- 12. FAQs (Screen 09)
INSERT INTO faqs (id, category, question, answer, sort_order, active) VALUES
('k0000000-0000-0000-0000-000000000001', 'General', 'What is Nourish Spoon?', 'Nourish Spoon is a home-grown brand offering premium Panjeeri, Date & Nut Energy Balls and healthy traditional recipes made with pure, natural ingredients — crafted with love for your family’s well-being.', 1, true),
('k0000000-0000-0000-0000-000000000002', 'Products', 'Are your products 100% natural?', 'Yes! We only use 100% natural ingredients like premium dates, dry fruits, desi ghee, and pure seeds. We never add refined white sugar, preservatives, artificial essences, or fillers.', 2, true),
('k0000000-0000-0000-0000-000000000003', 'Ordering', 'How do I place an order?', 'Simply select your desired product and size, tap "Order on WhatsApp", fill in your address, and send the prefilled WhatsApp message to our team (+92 304 6721962). We will promptly confirm your order.', 3, true),
('k0000000-0000-0000-0000-000000000004', 'Delivery', 'What payment methods do you accept?', 'We accept advance payments through Bank Transfer (Meezan Bank), EasyPaisa, and JazzCash. Cash on delivery is not offered to guarantee that every batch is freshly prepared on order.', 4, true),
('k0000000-0000-0000-0000-000000000005', 'Delivery', 'Do you ship across Pakistan?', 'Yes, we provide same-day local doorstep delivery in Sargodha and reliable nationwide delivery across all major cities of Pakistan via TCS (2–3 business days).', 5, true),
('k0000000-0000-0000-0000-000000000006', 'Gifting', 'Do you offer gift packaging?', 'Yes! We provide custom festive gift packaging with airtight safety seals and handwritten personalized gift cards for Eid, weddings, baby showers, or loved ones.', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 13. Promotional Banners
INSERT INTO banners (id, title, subtitle, image_url, cta_text, cta_action, sort_order, active) VALUES
('l0000000-0000-0000-0000-000000000001', 'Healthy Choices, Happier Lives', 'Nourishing families with pure, unadulterated goodness.', '/assets/admin/banner_healthy_choices.jpg', 'Explore Panjeeri', 'products', 1, true),
('l0000000-0000-0000-0000-000000000002', 'Crafted with Love in Sargodha', 'Small-batch, artisan nutrition made from cherished family recipes.', '/assets/admin/thumb_our_story.jpg', 'Our Story', 'about', 2, true)
ON CONFLICT (id) DO NOTHING;
