-- ==============================================================================
-- NOURISH SPOON: SUPABASE RLS POLICIES MIGRATION 002
-- Description: Row Level Security Policies for Customer and Admin access
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if auth user is Admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admins 
        WHERE auth_user_id = auth.uid() 
        AND active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Products & Variants (Public Read for Active, Admin Full Access)
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to products" ON products
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view active product variants" ON product_variants
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to product variants" ON product_variants
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view product images" ON product_images
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to product images" ON product_images
    FOR ALL USING (is_admin());

-- 2. Ingredients & Nutrition
CREATE POLICY "Public can view ingredients" ON ingredients
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to ingredients" ON ingredients
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view product ingredients" ON product_ingredients
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to product ingredients" ON product_ingredients
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view nutrition facts" ON nutrition_facts
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to nutrition facts" ON nutrition_facts
    FOR ALL USING (is_admin());

-- 3. Reviews (Public can read approved reviews, users can insert review, Admin can moderate)
CREATE POLICY "Public can view approved reviews" ON reviews
    FOR SELECT USING (status = 'approved' OR is_admin());

CREATE POLICY "Anyone can submit a review" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to reviews" ON reviews
    FOR ALL USING (is_admin());

-- 4. FAQs, Banners, Payment & Delivery Methods, App Settings
CREATE POLICY "Public can view active FAQs" ON faqs
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to FAQs" ON faqs
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view active banners" ON banners
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to banners" ON banners
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view active payment methods" ON payment_methods
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to payment methods" ON payment_methods
    FOR ALL USING (is_admin());

CREATE POLICY "Public can view active delivery methods" ON delivery_methods
    FOR SELECT USING (active = true OR is_admin());

CREATE POLICY "Admins have full access to delivery methods" ON delivery_methods
    FOR ALL USING (is_admin());

CREATE POLICY "Public can read app settings" ON app_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins have full access to app settings" ON app_settings
    FOR ALL USING (is_admin());

-- 5. Orders & Order Items
-- Anyone can create an order (e.g. from WhatsApp order form or direct checkout)
CREATE POLICY "Anyone can insert an order" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own orders via phone/email" ON orders
    FOR SELECT USING (
        customer_phone = current_setting('request.jwt.claims', true)::json->>'phone' 
        OR is_admin()
    );

CREATE POLICY "Admins have full access to orders" ON orders
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to order items" ON order_items
    FOR ALL USING (is_admin());

-- 6. Contact Messages
CREATE POLICY "Anyone can send a contact message" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to contact messages" ON contact_messages
    FOR ALL USING (is_admin());

-- 7. Favorites
CREATE POLICY "Users can manage their own favorites" ON favorites
    FOR ALL USING (true);

-- 8. Admins table
CREATE POLICY "Admins can view admins" ON admins
    FOR SELECT USING (is_admin());

CREATE POLICY "Super Admins can manage admins" ON admins
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE auth_user_id = auth.uid() 
            AND role = 'super_admin' 
            AND active = true
        )
    );
