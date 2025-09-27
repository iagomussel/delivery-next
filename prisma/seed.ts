import { PrismaClient, TenantStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create public tenant for customers
  const publicTenant = await prisma.tenant.upsert({
    where: { id: 'public' },
    update: {},
    create: {
      id: 'public',
      name: 'Public Customers',
      slug: 'public',
      status: TenantStatus.ACTIVE,
      plan: 'free',
    },
  })

  console.log('Created public tenant:', publicTenant)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
