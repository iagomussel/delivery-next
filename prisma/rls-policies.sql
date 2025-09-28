-- Row Level Security (RLS) Policies for DeliveryNext
-- This file contains comprehensive RLS policies to ensure tenant isolation
-- and proper data access control for all users.

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_option_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant ID from JWT
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT AS $$
BEGIN
  -- This function should be called from application context
  -- where the tenant ID is set via SET LOCAL or similar
  RETURN current_setting('app.current_tenant_id', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's role from JWT
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_role', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user's ID from JWT
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_user_role() = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is owner or staff
CREATE OR REPLACE FUNCTION is_restaurant_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_user_role() IN ('OWNER', 'STAFF');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is customer
CREATE OR REPLACE FUNCTION is_customer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_user_role() = 'CUSTOMER';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is affiliate
CREATE OR REPLACE FUNCTION is_affiliate()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_user_role() = 'AFFILIATE';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TENANTS TABLE POLICIES
-- ============================================================================

-- Admins can see all tenants
CREATE POLICY "Admins can view all tenants" ON tenants
  FOR SELECT USING (is_admin());

-- Admins can insert tenants
CREATE POLICY "Admins can insert tenants" ON tenants
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update tenants
CREATE POLICY "Admins can update tenants" ON tenants
  FOR UPDATE USING (is_admin());

-- Admins can delete tenants
CREATE POLICY "Admins can delete tenants" ON tenants
  FOR DELETE USING (is_admin());

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view users in their tenant
CREATE POLICY "Users can view tenant users" ON users
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- Admins can view all users
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (is_admin());

-- Users can insert users in their tenant (for restaurant owners/staff)
CREATE POLICY "Restaurant users can create tenant users" ON users
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Admins can insert users anywhere
CREATE POLICY "Admins can create users" ON users
  FOR INSERT WITH CHECK (is_admin());

-- Users can update themselves
CREATE POLICY "Users can update themselves" ON users
  FOR UPDATE USING (id = get_current_user_id());

-- Restaurant users can update users in their tenant
CREATE POLICY "Restaurant users can update tenant users" ON users
  FOR UPDATE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Admins can update all users
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE USING (is_admin());

-- Restaurant users can delete users in their tenant (except themselves)
CREATE POLICY "Restaurant users can delete tenant users" ON users
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user() AND
    id != get_current_user_id()
  );

-- Admins can delete all users
CREATE POLICY "Admins can delete all users" ON users
  FOR DELETE USING (is_admin());

-- ============================================================================
-- RESTAURANTS TABLE POLICIES
-- ============================================================================

-- Users can view restaurants in their tenant
CREATE POLICY "Users can view tenant restaurants" ON restaurants
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- Public can view restaurants (for customer menu access)
CREATE POLICY "Public can view restaurants" ON restaurants
  FOR SELECT USING (true);

-- Restaurant users can insert restaurants in their tenant
CREATE POLICY "Restaurant users can create tenant restaurants" ON restaurants
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can update restaurants in their tenant
CREATE POLICY "Restaurant users can update tenant restaurants" ON restaurants
  FOR UPDATE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can delete restaurants in their tenant
CREATE POLICY "Restaurant users can delete tenant restaurants" ON restaurants
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- ============================================================================

-- Users can view categories from restaurants in their tenant
CREATE POLICY "Users can view tenant categories" ON categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = categories.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert categories for their restaurants
CREATE POLICY "Restaurant users can create categories" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = categories.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update categories for their restaurants
CREATE POLICY "Restaurant users can update categories" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = categories.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete categories for their restaurants
CREATE POLICY "Restaurant users can delete categories" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = categories.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- PRODUCTS TABLE POLICIES
-- ============================================================================

-- Users can view products from restaurants in their tenant
CREATE POLICY "Users can view tenant products" ON products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = products.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Public can view products (for customer menu access)
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Restaurant users can insert products for their restaurants
CREATE POLICY "Restaurant users can create products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = products.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update products for their restaurants
CREATE POLICY "Restaurant users can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = products.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete products for their restaurants
CREATE POLICY "Restaurant users can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = products.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- OPTION GROUPS TABLE POLICIES
-- ============================================================================

-- Users can view option groups from restaurants in their tenant
CREATE POLICY "Users can view tenant option groups" ON option_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = option_groups.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert option groups for their restaurants
CREATE POLICY "Restaurant users can create option groups" ON option_groups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = option_groups.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update option groups for their restaurants
CREATE POLICY "Restaurant users can update option groups" ON option_groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = option_groups.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete option groups for their restaurants
CREATE POLICY "Restaurant users can delete option groups" ON option_groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = option_groups.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- PRODUCT OPTION GROUPS TABLE POLICIES
-- ============================================================================

-- Users can view product option groups from restaurants in their tenant
CREATE POLICY "Users can view tenant product option groups" ON product_option_groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN restaurants ON restaurants.id = products.restaurant_id 
      WHERE products.id = product_option_groups.product_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert product option groups for their restaurants
CREATE POLICY "Restaurant users can create product option groups" ON product_option_groups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM products 
      JOIN restaurants ON restaurants.id = products.restaurant_id 
      WHERE products.id = product_option_groups.product_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update product option groups for their restaurants
CREATE POLICY "Restaurant users can update product option groups" ON product_option_groups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN restaurants ON restaurants.id = products.restaurant_id 
      WHERE products.id = product_option_groups.product_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete product option groups for their restaurants
CREATE POLICY "Restaurant users can delete product option groups" ON product_option_groups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM products 
      JOIN restaurants ON restaurants.id = products.restaurant_id 
      WHERE products.id = product_option_groups.product_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- OPTIONS TABLE POLICIES
-- ============================================================================

-- Users can view options from restaurants in their tenant
CREATE POLICY "Users can view tenant options" ON options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM option_groups 
      JOIN restaurants ON restaurants.id = option_groups.restaurant_id 
      WHERE option_groups.id = options.option_group_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert options for their restaurants
CREATE POLICY "Restaurant users can create options" ON options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM option_groups 
      JOIN restaurants ON restaurants.id = option_groups.restaurant_id 
      WHERE option_groups.id = options.option_group_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update options for their restaurants
CREATE POLICY "Restaurant users can update options" ON options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM option_groups 
      JOIN restaurants ON restaurants.id = option_groups.restaurant_id 
      WHERE option_groups.id = options.option_group_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete options for their restaurants
CREATE POLICY "Restaurant users can delete options" ON options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM option_groups 
      JOIN restaurants ON restaurants.id = option_groups.restaurant_id 
      WHERE option_groups.id = options.option_group_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- CUSTOMERS TABLE POLICIES
-- ============================================================================

-- Users can view customers in their tenant
CREATE POLICY "Users can view tenant customers" ON customers
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- Restaurant users can insert customers in their tenant
CREATE POLICY "Restaurant users can create tenant customers" ON customers
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can update customers in their tenant
CREATE POLICY "Restaurant users can update tenant customers" ON customers
  FOR UPDATE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can delete customers in their tenant
CREATE POLICY "Restaurant users can delete tenant customers" ON customers
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- ============================================================================
-- ADDRESSES TABLE POLICIES
-- ============================================================================

-- Users can view addresses for customers in their tenant
CREATE POLICY "Users can view tenant addresses" ON addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = addresses.customer_id 
      AND customers.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert addresses for customers in their tenant
CREATE POLICY "Restaurant users can create tenant addresses" ON addresses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = addresses.customer_id 
      AND customers.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update addresses for customers in their tenant
CREATE POLICY "Restaurant users can update tenant addresses" ON addresses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = addresses.customer_id 
      AND customers.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete addresses for customers in their tenant
CREATE POLICY "Restaurant users can delete tenant addresses" ON addresses
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM customers 
      WHERE customers.id = addresses.customer_id 
      AND customers.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- ORDERS TABLE POLICIES
-- ============================================================================

-- Users can view orders from restaurants in their tenant
CREATE POLICY "Users can view tenant orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert orders for their restaurants
CREATE POLICY "Restaurant users can create orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update orders for their restaurants
CREATE POLICY "Restaurant users can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete orders for their restaurants
CREATE POLICY "Restaurant users can delete orders" ON orders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM restaurants 
      WHERE restaurants.id = orders.restaurant_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- ORDER ITEMS TABLE POLICIES
-- ============================================================================

-- Users can view order items from orders in their tenant
CREATE POLICY "Users can view tenant order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_items.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert order items for orders in their tenant
CREATE POLICY "Restaurant users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_items.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update order items for orders in their tenant
CREATE POLICY "Restaurant users can update order items" ON order_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_items.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete order items for orders in their tenant
CREATE POLICY "Restaurant users can delete order items" ON order_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_items.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- ORDER ITEM OPTIONS TABLE POLICIES
-- ============================================================================

-- Users can view order item options from orders in their tenant
CREATE POLICY "Users can view tenant order item options" ON order_item_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM order_items 
      JOIN orders ON orders.id = order_items.order_id 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE order_items.id = order_item_options.order_item_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert order item options for orders in their tenant
CREATE POLICY "Restaurant users can create order item options" ON order_item_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM order_items 
      JOIN orders ON orders.id = order_items.order_id 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE order_items.id = order_item_options.order_item_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update order item options for orders in their tenant
CREATE POLICY "Restaurant users can update order item options" ON order_item_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM order_items 
      JOIN orders ON orders.id = order_items.order_id 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE order_items.id = order_item_options.order_item_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete order item options for orders in their tenant
CREATE POLICY "Restaurant users can delete order item options" ON order_item_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM order_items 
      JOIN orders ON orders.id = order_items.order_id 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE order_items.id = order_item_options.order_item_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- ORDER EVENTS TABLE POLICIES
-- ============================================================================

-- Users can view order events from orders in their tenant
CREATE POLICY "Users can view tenant order events" ON order_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_events.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert order events for orders in their tenant
CREATE POLICY "Restaurant users can create order events" ON order_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_events.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update order events for orders in their tenant
CREATE POLICY "Restaurant users can update order events" ON order_events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_events.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete order events for orders in their tenant
CREATE POLICY "Restaurant users can delete order events" ON order_events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN restaurants ON restaurants.id = orders.restaurant_id 
      WHERE orders.id = order_events.order_id 
      AND restaurants.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- ============================================================================
-- AFFILIATES TABLE POLICIES
-- ============================================================================

-- Users can view affiliates in their tenant
CREATE POLICY "Users can view tenant affiliates" ON affiliates
  FOR SELECT USING (tenant_id = get_current_tenant_id());

-- Restaurant users can insert affiliates in their tenant
CREATE POLICY "Restaurant users can create tenant affiliates" ON affiliates
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can update affiliates in their tenant
CREATE POLICY "Restaurant users can update tenant affiliates" ON affiliates
  FOR UPDATE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- Restaurant users can delete affiliates in their tenant
CREATE POLICY "Restaurant users can delete tenant affiliates" ON affiliates
  FOR DELETE USING (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );

-- ============================================================================
-- AFFILIATE CONVERSIONS TABLE POLICIES
-- ============================================================================

-- Users can view affiliate conversions for affiliates in their tenant
CREATE POLICY "Users can view tenant affiliate conversions" ON affiliate_conversions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE affiliates.id = affiliate_conversions.affiliate_id 
      AND affiliates.tenant_id = get_current_tenant_id()
    )
  );

-- Restaurant users can insert affiliate conversions for affiliates in their tenant
CREATE POLICY "Restaurant users can create affiliate conversions" ON affiliate_conversions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE affiliates.id = affiliate_conversions.affiliate_id 
      AND affiliates.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can update affiliate conversions for affiliates in their tenant
CREATE POLICY "Restaurant users can update affiliate conversions" ON affiliate_conversions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE affiliates.id = affiliate_conversions.affiliate_id 
      AND affiliates.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );

-- Restaurant users can delete affiliate conversions for affiliates in their tenant
CREATE POLICY "Restaurant users can delete affiliate conversions" ON affiliate_conversions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM affiliates 
      WHERE affiliates.id = affiliate_conversions.affiliate_id 
      AND affiliates.tenant_id = get_current_tenant_id()
    ) AND is_restaurant_user()
  );
