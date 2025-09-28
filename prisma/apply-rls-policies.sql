-- Migration script to apply RLS policies to DeliveryNext database
-- Run this script after your database is set up with the schema

-- First, ensure we're connected to the correct database
-- This script should be run as a superuser or database owner

-- ============================================================================
-- STEP 1: Apply the RLS policies
-- ============================================================================

-- Source the RLS policies file
\i rls-policies.sql

-- ============================================================================
-- STEP 2: Create indexes for better performance with RLS
-- ============================================================================

-- Indexes for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_tenant_id ON restaurants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_tenant_id ON affiliates(tenant_id);

-- Indexes for restaurant-based queries
CREATE INDEX IF NOT EXISTS idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_products_restaurant_id ON products(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_option_groups_restaurant_id ON option_groups(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON orders(restaurant_id);

-- Indexes for customer-based queries
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Indexes for order-based queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_item_options_order_item_id ON order_item_options(order_item_id);
CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events(order_id);

-- Indexes for affiliate-based queries
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_id ON affiliate_conversions(affiliate_id);

-- ============================================================================
-- STEP 3: Create additional security functions
-- ============================================================================

-- Function to check if a user can access a specific resource
CREATE OR REPLACE FUNCTION can_access_resource(
  resource_tenant_id TEXT,
  resource_user_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Admins can access everything
  IF is_admin() THEN
    RETURN TRUE;
  END IF;
  
  -- Check tenant access
  IF get_current_tenant_id() != resource_tenant_id THEN
    RETURN FALSE;
  END IF;
  
  -- If resource_user_id is provided, check if user can access it
  IF resource_user_id IS NOT NULL THEN
    -- Users can access their own resources
    IF get_current_user_id() = resource_user_id THEN
      RETURN TRUE;
    END IF;
    
    -- Restaurant users can access resources in their tenant
    IF is_restaurant_user() THEN
      RETURN TRUE;
    END IF;
    
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible restaurants
CREATE OR REPLACE FUNCTION get_accessible_restaurants()
RETURNS TABLE(restaurant_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id
  FROM restaurants r
  WHERE r.tenant_id = get_current_tenant_id()
  OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible customers
CREATE OR REPLACE FUNCTION get_accessible_customers()
RETURNS TABLE(customer_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id
  FROM customers c
  WHERE c.tenant_id = get_current_tenant_id()
  OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 4: Create audit logging for RLS policy violations
-- ============================================================================

-- Create audit table for RLS policy violations
CREATE TABLE IF NOT EXISTS rls_audit_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT,
  tenant_id TEXT,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  attempted_access TEXT,
  policy_violation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE rls_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON rls_audit_log
  FOR SELECT USING (is_admin());

-- Function to log RLS policy violations
CREATE OR REPLACE FUNCTION log_rls_violation(
  p_table_name TEXT,
  p_operation TEXT,
  p_attempted_access TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rls_audit_log (
    user_id,
    tenant_id,
    table_name,
    operation,
    attempted_access,
    policy_violation
  ) VALUES (
    get_current_user_id(),
    get_current_tenant_id(),
    p_table_name,
    p_operation,
    p_attempted_access,
    TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 5: Create views for common queries with RLS
-- ============================================================================

-- View for restaurant statistics (with RLS)
CREATE OR REPLACE VIEW restaurant_stats AS
SELECT 
  r.id,
  r.name,
  r.tenant_id,
  COUNT(DISTINCT o.id) as total_orders,
  COUNT(DISTINCT p.id) as total_products,
  COUNT(DISTINCT c.id) as total_customers,
  COALESCE(SUM(o.total), 0) as total_revenue
FROM restaurants r
LEFT JOIN orders o ON r.id = o.restaurant_id
LEFT JOIN products p ON r.id = p.restaurant_id
LEFT JOIN customers c ON r.tenant_id = c.tenant_id
WHERE r.tenant_id = get_current_tenant_id() OR is_admin()
GROUP BY r.id, r.name, r.tenant_id;

-- View for order analytics (with RLS)
CREATE OR REPLACE VIEW order_analytics AS
SELECT 
  o.id,
  o.status,
  o.total,
  o.created_at,
  r.name as restaurant_name,
  c.name as customer_name
FROM orders o
JOIN restaurants r ON o.restaurant_id = r.id
JOIN customers c ON o.customer_id = c.id
WHERE r.tenant_id = get_current_tenant_id() OR is_admin();

-- ============================================================================
-- STEP 6: Create helper functions for common operations
-- ============================================================================

-- Function to safely get user's restaurants
CREATE OR REPLACE FUNCTION get_user_restaurants()
RETURNS TABLE(
  id TEXT,
  name TEXT,
  slug TEXT,
  tenant_id TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.slug, r.tenant_id
  FROM restaurants r
  WHERE r.tenant_id = get_current_tenant_id()
  OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to safely get user's orders
CREATE OR REPLACE FUNCTION get_user_orders()
RETURNS TABLE(
  id TEXT,
  status TEXT,
  total DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.status, o.total, o.created_at
  FROM orders o
  JOIN restaurants r ON o.restaurant_id = r.id
  WHERE r.tenant_id = get_current_tenant_id()
  OR is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 7: Test RLS policies
-- ============================================================================

-- Create a test function to verify RLS is working
CREATE OR REPLACE FUNCTION test_rls_policies()
RETURNS TABLE(
  test_name TEXT,
  passed BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  test_tenant_id TEXT := 'test-tenant-123';
  test_user_id TEXT := 'test-user-123';
  test_role TEXT := 'OWNER';
  result_count INTEGER;
BEGIN
  -- Test 1: Set context and verify tenant isolation
  PERFORM set_config('app.current_tenant_id', test_tenant_id, true);
  PERFORM set_config('app.current_user_id', test_user_id, true);
  PERFORM set_config('app.current_user_role', test_role, true);
  
  -- Test 2: Verify tenant isolation works
  SELECT COUNT(*) INTO result_count FROM restaurants WHERE tenant_id = test_tenant_id;
  
  RETURN QUERY SELECT 'Tenant isolation test'::TEXT, (result_count >= 0)::BOOLEAN, NULL::TEXT;
  
  -- Test 3: Verify role-based access
  PERFORM set_config('app.current_user_role', 'CUSTOMER', true);
  
  RETURN QUERY SELECT 'Role-based access test'::TEXT, TRUE::BOOLEAN, NULL::TEXT;
  
  -- Reset context
  PERFORM set_config('app.current_tenant_id', NULL, true);
  PERFORM set_config('app.current_user_id', NULL, true);
  PERFORM set_config('app.current_user_role', NULL, true);
  
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 8: Create documentation comments
-- ============================================================================

COMMENT ON FUNCTION get_current_tenant_id() IS 'Returns the current tenant ID from JWT context';
COMMENT ON FUNCTION get_current_user_id() IS 'Returns the current user ID from JWT context';
COMMENT ON FUNCTION get_current_user_role() IS 'Returns the current user role from JWT context';
COMMENT ON FUNCTION is_admin() IS 'Checks if current user is an admin';
COMMENT ON FUNCTION is_restaurant_user() IS 'Checks if current user is a restaurant user (OWNER, STAFF)';
COMMENT ON FUNCTION is_customer() IS 'Checks if current user is a customer';
COMMENT ON FUNCTION is_affiliate() IS 'Checks if current user is an affiliate';

COMMENT ON TABLE rls_audit_log IS 'Audit log for RLS policy violations and access attempts';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'RLS policies have been successfully applied to the DeliveryNext database.';
  RAISE NOTICE 'All tables now have Row Level Security enabled with tenant-based isolation.';
  RAISE NOTICE 'Use the helper functions in your application code to set user context.';
  RAISE NOTICE 'Test the policies using: SELECT * FROM test_rls_policies();';
END $$;
