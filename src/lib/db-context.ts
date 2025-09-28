import { PrismaClient } from '@prisma/client'

// Extended Prisma client with RLS context
export class PrismaClientWithRLS extends PrismaClient {
  private currentTenantId: string | null = null
  private currentUserId: string | null = null
  private currentUserRole: string | null = null

  // Set the current user context for RLS policies
  async setUserContext(tenantId: string, userId: string, role: string) {
    this.currentTenantId = tenantId
    this.currentUserId = userId
    this.currentUserRole = role

    // Set the context variables that RLS policies will use
    await this.$executeRaw`SET LOCAL app.current_tenant_id = ${tenantId}`
    await this.$executeRaw`SET LOCAL app.current_user_id = ${userId}`
    await this.$executeRaw`SET LOCAL app.current_user_role = ${role}`
  }

  // Clear the current user context
  async clearUserContext() {
    this.currentTenantId = null
    this.currentUserId = null
    this.currentUserRole = null

    await this.$executeRaw`RESET app.current_tenant_id`
    await this.$executeRaw`RESET app.current_user_id`
    await this.$executeRaw`RESET app.current_user_role`
  }

  // Get current context (for debugging)
  getCurrentContext() {
    return {
      tenantId: this.currentTenantId,
      userId: this.currentUserId,
      role: this.currentUserRole,
    }
  }

  // Override the $transaction method to maintain context
  async $transaction<T>(
    fn: (prisma: PrismaClientWithRLS) => Promise<T>,
    options?: { maxWait?: number; timeout?: number }
  ): Promise<T> {
    return super.$transaction(async (prisma) => {
      const rlsPrisma = prisma as PrismaClientWithRLS
      
      // Copy context to the transaction client
      if (this.currentTenantId && this.currentUserId && this.currentUserRole) {
        await rlsPrisma.setUserContext(
          this.currentTenantId,
          this.currentUserId,
          this.currentUserRole
        )
      }
      
      return fn(rlsPrisma)
    }, options)
  }
}

// Create a singleton instance
export const prismaWithRLS = new PrismaClientWithRLS()

// Helper function to create a scoped Prisma client for API routes
export function createScopedPrisma(tenantId: string, userId: string, role: string) {
  const scopedPrisma = new PrismaClientWithRLS()
  scopedPrisma.setUserContext(tenantId, userId, role)
  return scopedPrisma
}

// Helper function to wrap API route handlers with RLS context
export function withRLSContext<T extends any[], R>(
  handler: (prisma: PrismaClientWithRLS, ...args: T) => Promise<R>
) {
  return async (tenantId: string, userId: string, role: string, ...args: T): Promise<R> => {
    const scopedPrisma = createScopedPrisma(tenantId, userId, role)
    try {
      return await handler(scopedPrisma, ...args)
    } finally {
      await scopedPrisma.$disconnect()
    }
  }
}
