# Row Level Security (RLS) Implementation Guide

This document explains how Row Level Security (RLS) is implemented in the DeliveryNext application to ensure proper data isolation and access control.

## Overview

Row Level Security (RLS) is a PostgreSQL feature that automatically filters rows based on policies defined at the database level. This ensures that users can only access data they're authorized to see, even if the application code has bugs or security vulnerabilities.

## Architecture

### 1. Multi-Tenant Data Isolation
- Each tenant (restaurant group) has its own isolated data
- Users can only access data within their tenant
- Admins can access all tenant data

### 2. Role-Based Access Control
- **ADMIN**: Can access all data across all tenants
- **OWNER**: Can access all data within their tenant
- **STAFF**: Can access most data within their tenant
- **AFFILIATE**: Can access affiliate-related data within their tenant
- **CUSTOMER**: Can access their own data and public restaurant data

### 3. Context-Aware Policies
- RLS policies use JWT token context to determine access
- Context is set via PostgreSQL session variables
- Policies automatically filter data based on current user context

## Implementation

### Database Setup

1. **Apply RLS Policies**:
   ```bash
   # Connect to your PostgreSQL database and run:
   psql -d your_database -f prisma/rls-policies.sql
   psql -d your_database -f prisma/apply-rls-policies.sql
   ```

2. **Verify RLS is Enabled**:
   ```sql
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND rowsecurity = true;
   ```

### Application Integration

#### 1. Using RLS Middleware

Replace existing API routes with RLS-protected versions:

```typescript
// Before (manual tenant filtering)
export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  const decoded = verifyToken(token)
  
  const restaurants = await prisma.restaurant.findMany({
    where: { tenantId: decoded.tenantId } // Manual filtering
  })
  
  return NextResponse.json(restaurants)
}

// After (RLS automatic filtering)
export const GET = withRLS(async (request, prisma, user) => {
  // RLS automatically filters by tenant - no manual filtering needed
  const restaurants = await prisma.restaurant.findMany()
  
  return NextResponse.json(restaurants)
})
```

#### 2. Available Middleware Functions

- `withRLS()` - Basic RLS with authentication
- `withPublicRLS()` - Public endpoints (no auth required)
- `withAdminRLS()` - Admin-only endpoints
- `withRestaurantRLS()` - Restaurant users (OWNER, STAFF, ADMIN)
- `withCustomerRLS()` - Customer-only endpoints
- `withAffiliateRLS()` - Affiliate-only endpoints

#### 3. Setting User Context

The RLS middleware automatically sets the user context:

```typescript
// This happens automatically in the middleware
await prisma.setUserContext(tenantId, userId, role)
```

### RLS Policies Explained

#### 1. Tenant Isolation
All policies ensure users can only access data within their tenant:

```sql
-- Example: Users can only see users in their tenant
CREATE POLICY "Users can view tenant users" ON users
  FOR SELECT USING (tenant_id = get_current_tenant_id());
```

#### 2. Role-Based Access
Different roles have different access levels:

```sql
-- Admins can see all tenants
CREATE POLICY "Admins can view all tenants" ON tenants
  FOR SELECT USING (is_admin());

-- Restaurant users can manage their tenant's data
CREATE POLICY "Restaurant users can create tenant restaurants" ON restaurants
  FOR INSERT WITH CHECK (
    tenant_id = get_current_tenant_id() AND 
    is_restaurant_user()
  );
```

#### 3. Resource Ownership
Users can access their own resources and tenant resources:

```sql
-- Users can update themselves
CREATE POLICY "Users can update themselves" ON users
  FOR UPDATE USING (id = get_current_user_id());
```

## Migration Guide

### Step 1: Apply RLS Policies

1. **Backup your database**:
   ```bash
   pg_dump your_database > backup_before_rls.sql
   ```

2. **Apply RLS policies**:
   ```bash
   psql -d your_database -f prisma/rls-policies.sql
   psql -d your_database -f prisma/apply-rls-policies.sql
   ```

3. **Test the policies**:
   ```sql
   SELECT * FROM test_rls_policies();
   ```

### Step 2: Update API Routes

1. **Install the RLS middleware**:
   ```typescript
   import { withRLS, withPublicRLS, withRestaurantRLS } from '@/lib/rls-middleware'
   ```

2. **Convert existing routes**:
   ```typescript
   // Old route
   export async function GET(request: NextRequest) {
     // Manual auth and filtering
   }
   
   // New RLS route
   export const GET = withRLS(async (request, prisma, user) => {
     // Automatic auth and filtering
   })
   ```

3. **Remove manual tenant filtering**:
   ```typescript
   // Remove this kind of code:
   where: { tenantId: decoded.tenantId }
   
   // RLS handles it automatically
   ```

### Step 3: Update Database Connections

1. **Use the RLS-enabled Prisma client**:
   ```typescript
   import { prismaWithRLS } from '@/lib/db-context'
   
   // Instead of regular prisma
   const result = await prismaWithRLS.restaurant.findMany()
   ```

2. **Set user context in API routes**:
   ```typescript
   // This is handled automatically by the middleware
   await prismaWithRLS.setUserContext(tenantId, userId, role)
   ```

## Testing RLS Policies

### 1. Test Tenant Isolation

```sql
-- Set context for tenant A
SET LOCAL app.current_tenant_id = 'tenant-a';
SET LOCAL app.current_user_id = 'user-a';
SET LOCAL app.current_user_role = 'OWNER';

-- Should only see tenant A data
SELECT COUNT(*) FROM restaurants; -- Should return tenant A restaurants only

-- Set context for tenant B
SET LOCAL app.current_tenant_id = 'tenant-b';
SET LOCAL app.current_user_id = 'user-b';
SET LOCAL app.current_user_role = 'OWNER';

-- Should only see tenant B data
SELECT COUNT(*) FROM restaurants; -- Should return tenant B restaurants only
```

### 2. Test Role-Based Access

```sql
-- Test admin access
SET LOCAL app.current_user_role = 'ADMIN';
SELECT COUNT(*) FROM tenants; -- Should see all tenants

-- Test customer access
SET LOCAL app.current_user_role = 'CUSTOMER';
SELECT COUNT(*) FROM tenants; -- Should see no tenants (customers can't access tenant data)
```

### 3. Test Policy Violations

```sql
-- Try to access data from different tenant
SET LOCAL app.current_tenant_id = 'tenant-a';
SELECT * FROM restaurants WHERE tenant_id = 'tenant-b'; -- Should return no rows
```

## Security Benefits

### 1. Defense in Depth
- Even if application code has bugs, RLS prevents data leaks
- Database-level security is harder to bypass
- Policies are enforced regardless of application logic

### 2. Automatic Filtering
- No need to remember to add tenant filters in every query
- Reduces chance of human error
- Consistent security across all endpoints

### 3. Audit Trail
- RLS audit log tracks policy violations
- Helps identify security issues
- Provides compliance documentation

## Performance Considerations

### 1. Indexes
The RLS implementation includes optimized indexes:

```sql
-- Tenant-based indexes
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_restaurants_tenant_id ON restaurants(tenant_id);

-- Restaurant-based indexes
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_products_restaurant_id ON products(restaurant_id);
```

### 2. Query Optimization
- RLS policies use efficient WHERE clauses
- Indexes support common query patterns
- Policies are evaluated at the database level

### 3. Connection Pooling
- RLS context is set per connection
- Use connection pooling carefully
- Clear context between requests

## Troubleshooting

### Common Issues

1. **"No context set" errors**:
   - Ensure RLS middleware is used
   - Check that user context is set before queries

2. **"Access denied" errors**:
   - Verify user role and tenant ID
   - Check RLS policy conditions
   - Review audit logs

3. **Performance issues**:
   - Check if indexes are being used
   - Monitor query execution plans
   - Consider query optimization

### Debugging

1. **Check current context**:
   ```sql
   SELECT 
     current_setting('app.current_tenant_id', true) as tenant_id,
     current_setting('app.current_user_id', true) as user_id,
     current_setting('app.current_user_role', true) as role;
   ```

2. **Review audit logs**:
   ```sql
   SELECT * FROM rls_audit_log 
   WHERE policy_violation = true 
   ORDER BY created_at DESC;
   ```

3. **Test policies manually**:
   ```sql
   SELECT * FROM test_rls_policies();
   ```

## Best Practices

### 1. Always Use RLS Middleware
- Don't bypass RLS for "performance"
- Use appropriate middleware for each endpoint
- Test with different user roles

### 2. Monitor Performance
- Use EXPLAIN ANALYZE on queries
- Monitor slow query logs
- Optimize indexes as needed

### 3. Regular Audits
- Review RLS audit logs
- Test policy effectiveness
- Update policies as needed

### 4. Documentation
- Document any custom policies
- Keep policy documentation updated
- Train team on RLS concepts

## Conclusion

RLS provides a robust, database-level security layer that ensures proper data isolation in the DeliveryNext application. By implementing these policies and using the provided middleware, you can be confident that users can only access their authorized data, even if application code has vulnerabilities.

The implementation is designed to be:
- **Secure**: Multi-tenant isolation with role-based access
- **Performant**: Optimized indexes and efficient policies
- **Maintainable**: Clear patterns and comprehensive documentation
- **Auditable**: Full logging of access attempts and violations
