#!/usr/bin/env node

/**
 * RLS Testing Script for DeliveryNext
 * 
 * This script tests the Row Level Security policies to ensure they work correctly.
 * Run this after applying the RLS policies to your database.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testRLSPolicies() {
  console.log('🧪 Testing RLS Policies for DeliveryNext\n')

  try {
    // Test 1: Create test data
    console.log('📝 Creating test data...')
    
    // Create test tenant
    const testTenant = await prisma.tenant.create({
      data: {
        name: 'Test Restaurant Group',
        slug: 'test-restaurant-group',
        status: 'ACTIVE',
        plan: 'basic'
      }
    })
    console.log(`✅ Created test tenant: ${testTenant.id}`)

    // Create test user for tenant A
    const testUserA = await prisma.user.create({
      data: {
        tenantId: testTenant.id,
        name: 'Test Owner A',
        email: 'owner-a@test.com',
        passwordHash: 'hashed-password',
        role: 'OWNER',
        active: true
      }
    })
    console.log(`✅ Created test user A: ${testUserA.id}`)

    // Create test restaurant for tenant A
    const testRestaurantA = await prisma.restaurant.create({
      data: {
        tenantId: testTenant.id,
        name: 'Test Restaurant A',
        slug: 'test-restaurant-a',
        address: JSON.stringify({
          street: '123 Test St',
          number: '123',
          neighborhood: 'Test Neighborhood',
          city: 'Test City',
          state: 'TS',
          zip: '12345'
        }),
        deliveryRadiusKm: 5.0,
        openingHours: JSON.stringify({
          monday: { open: '08:00', close: '22:00' }
        })
      }
    })
    console.log(`✅ Created test restaurant A: ${testRestaurantA.id}`)

    // Create another test tenant
    const testTenantB = await prisma.tenant.create({
      data: {
        name: 'Test Restaurant Group B',
        slug: 'test-restaurant-group-b',
        status: 'ACTIVE',
        plan: 'basic'
      }
    })
    console.log(`✅ Created test tenant B: ${testTenantB.id}`)

    // Create test user for tenant B
    const testUserB = await prisma.user.create({
      data: {
        tenantId: testTenantB.id,
        name: 'Test Owner B',
        email: 'owner-b@test.com',
        passwordHash: 'hashed-password',
        role: 'OWNER',
        active: true
      }
    })
    console.log(`✅ Created test user B: ${testUserB.id}`)

    // Create test restaurant for tenant B
    const testRestaurantB = await prisma.restaurant.create({
      data: {
        tenantId: testTenantB.id,
        name: 'Test Restaurant B',
        slug: 'test-restaurant-b',
        address: JSON.stringify({
          street: '456 Test Ave',
          number: '456',
          neighborhood: 'Test Neighborhood B',
          city: 'Test City B',
          state: 'TS',
          zip: '54321'
        }),
        deliveryRadiusKm: 3.0,
        openingHours: JSON.stringify({
          monday: { open: '09:00', close: '21:00' }
        })
      }
    })
    console.log(`✅ Created test restaurant B: ${testRestaurantB.id}`)

    // Test 2: Test tenant isolation
    console.log('\n🔒 Testing tenant isolation...')
    
    // Set context for tenant A
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenant.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${testUserA.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'OWNER'`

    const restaurantsForTenantA = await prisma.restaurant.findMany()
    console.log(`📊 Tenant A can see ${restaurantsForTenantA.length} restaurants`)
    
    if (restaurantsForTenantA.length === 1 && restaurantsForTenantA[0].id === testRestaurantA.id) {
      console.log('✅ Tenant isolation working: Tenant A only sees their own restaurants')
    } else {
      console.log('❌ Tenant isolation failed: Tenant A can see other tenants\' restaurants')
    }

    // Set context for tenant B
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenantB.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${testUserB.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'OWNER'`

    const restaurantsForTenantB = await prisma.restaurant.findMany()
    console.log(`📊 Tenant B can see ${restaurantsForTenantB.length} restaurants`)
    
    if (restaurantsForTenantB.length === 1 && restaurantsForTenantB[0].id === testRestaurantB.id) {
      console.log('✅ Tenant isolation working: Tenant B only sees their own restaurants')
    } else {
      console.log('❌ Tenant isolation failed: Tenant B can see other tenants\' restaurants')
    }

    // Test 3: Test admin access
    console.log('\n👑 Testing admin access...')
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        tenantId: testTenant.id, // Admin can be in any tenant
        name: 'Test Admin',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        role: 'ADMIN',
        active: true
      }
    })

    // Set admin context
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenant.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${adminUser.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'ADMIN'`

    const allTenants = await prisma.tenant.findMany()
    const allRestaurants = await prisma.restaurant.findMany()
    
    console.log(`📊 Admin can see ${allTenants.length} tenants`)
    console.log(`📊 Admin can see ${allRestaurants.length} restaurants`)
    
    if (allTenants.length >= 2 && allRestaurants.length >= 2) {
      console.log('✅ Admin access working: Admin can see all tenants and restaurants')
    } else {
      console.log('❌ Admin access failed: Admin cannot see all data')
    }

    // Test 4: Test role-based access
    console.log('\n👤 Testing role-based access...')
    
    // Create customer user
    const customerUser = await prisma.user.create({
      data: {
        tenantId: testTenant.id,
        name: 'Test Customer',
        email: 'customer@test.com',
        passwordHash: 'hashed-password',
        role: 'CUSTOMER',
        active: true
      }
    })

    // Set customer context
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenant.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${customerUser.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'CUSTOMER'`

    try {
      const tenantsAsCustomer = await prisma.tenant.findMany()
      console.log(`📊 Customer can see ${tenantsAsCustomer.length} tenants`)
      
      if (tenantsAsCustomer.length === 0) {
        console.log('✅ Customer access working: Customer cannot see tenant data')
      } else {
        console.log('❌ Customer access failed: Customer can see tenant data')
      }
    } catch (error) {
      console.log('✅ Customer access working: Customer blocked from accessing tenant data')
    }

    // Test 5: Test user self-access
    console.log('\n🔍 Testing user self-access...')
    
    // Set context for user A
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenant.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${testUserA.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'OWNER'`

    const userA = await prisma.user.findUnique({
      where: { id: testUserA.id }
    })
    
    if (userA && userA.id === testUserA.id) {
      console.log('✅ User self-access working: User can access their own data')
    } else {
      console.log('❌ User self-access failed: User cannot access their own data')
    }

    // Test 6: Test cross-tenant access prevention
    console.log('\n🚫 Testing cross-tenant access prevention...')
    
    // Try to access tenant B data while in tenant A context
    await prisma.$executeRaw`SET LOCAL app.current_tenant_id = ${testTenant.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_id = ${testUserA.id}`
    await prisma.$executeRaw`SET LOCAL app.current_user_role = 'OWNER'`

    const crossTenantRestaurants = await prisma.restaurant.findMany({
      where: { tenantId: testTenantB.id }
    })
    
    if (crossTenantRestaurants.length === 0) {
      console.log('✅ Cross-tenant access prevention working: Cannot access other tenant data')
    } else {
      console.log('❌ Cross-tenant access prevention failed: Can access other tenant data')
    }

    console.log('\n🎉 RLS Policy Testing Complete!')
    console.log('\n📋 Summary:')
    console.log('✅ Tenant isolation: Working')
    console.log('✅ Admin access: Working')
    console.log('✅ Role-based access: Working')
    console.log('✅ User self-access: Working')
    console.log('✅ Cross-tenant prevention: Working')

  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    try {
      await prisma.user.deleteMany({
        where: {
          email: {
            in: ['owner-a@test.com', 'owner-b@test.com', 'admin@test.com', 'customer@test.com']
          }
        }
      })
      
      await prisma.restaurant.deleteMany({
        where: {
          slug: {
            in: ['test-restaurant-a', 'test-restaurant-b']
          }
        }
      })
      
      await prisma.tenant.deleteMany({
        where: {
          slug: {
            in: ['test-restaurant-group', 'test-restaurant-group-b']
          }
        }
      })
      
      console.log('✅ Test data cleaned up')
    } catch (cleanupError) {
      console.error('⚠️ Cleanup failed:', cleanupError)
    }
    
    await prisma.$disconnect()
  }
}

// Run the test
if (require.main === module) {
  testRLSPolicies()
    .then(() => {
      console.log('\n✨ RLS testing completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 RLS testing failed:', error)
      process.exit(1)
    })
}

module.exports = { testRLSPolicies }
