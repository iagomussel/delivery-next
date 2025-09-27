import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, hashPassword } from '@/lib/auth'
// Enums are now strings in the schema
type UserRole = 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get all users in the same tenant (employees)
    const employees = await prisma.user.findMany({
      where: { 
        tenantId: decoded.tenantId,
        role: {
          in: ['OWNER', 'STAFF', 'AFFILIATE', 'ADMIN']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Format response to match frontend interface
    const formattedEmployees = employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: '', // Add phone field to User schema if needed
      role: employee.role.toLowerCase(),
      status: employee.active ? 'active' : 'inactive',
      createdAt: employee.createdAt.toISOString(),
      lastLogin: employee.updatedAt.toISOString() // Use updatedAt as proxy for lastLogin
    }))

    return NextResponse.json(formattedEmployees)
  } catch (error) {
    console.error('Employees GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Only OWNER and ADMIN can create employees
    if (decoded.role !== 'OWNER' && decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new employee
    const hashedPassword = await hashPassword(password)
    const newEmployee = await prisma.user.create({
      data: {
        tenantId: decoded.tenantId,
        name,
        email,
        passwordHash: hashedPassword,
        role: role.toUpperCase() as UserRole,
        active: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true
      }
    })

    // Format response
    const formattedEmployee = {
      id: newEmployee.id,
      name: newEmployee.name,
      email: newEmployee.email,
      phone: '',
      role: newEmployee.role.toLowerCase(),
      status: newEmployee.active ? 'active' : 'inactive',
      createdAt: newEmployee.createdAt.toISOString(),
      lastLogin: newEmployee.createdAt.toISOString()
    }

    return NextResponse.json(formattedEmployee, { status: 201 })
  } catch (error) {
    console.error('Employee POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
