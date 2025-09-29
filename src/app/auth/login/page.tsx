'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // BYPASS LOGIN - Acesso direto sem autenticação
    setTimeout(() => {
      // Simular token e usuário fake
      const fakeToken = 'bypass-token-' + Date.now()
      const fakeUser = {
        id: 'bypass-user',
        name: 'Usuário Bypass',
        email: email || 'bypass@test.com',
        role: 'ADMIN', // Pode mudar para OWNER, STAFF, CUSTOMER conforme necessário
        tenant: {
          id: 'bypass-tenant',
          name: 'Tenant Bypass',
          slug: 'bypass'
        }
      }

      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(fakeUser))
      
      // Redirecionar baseado no role fake
      if (fakeUser.role === 'ADMIN') {
        router.push('/admin')
      } else if (fakeUser.role === 'OWNER' || fakeUser.role === 'STAFF') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
      
      setLoading(false)
    }, 500) // Simular delay de rede
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">DeliveryNext</h1>
          <h2 className="mt-6 text-xl text-gray-600">Entre na sua conta</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">
              🚀 BYPASS LOGIN (Desenvolvimento)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  localStorage.setItem('token', 'bypass-admin-' + Date.now())
                  localStorage.setItem('user', JSON.stringify({
                    id: 'admin-bypass',
                    name: 'Admin Bypass',
                    email: 'admin@bypass.com',
                    role: 'ADMIN',
                    tenant: { id: 'bypass-tenant', name: 'Bypass Tenant', slug: 'bypass' }
                  }))
                  router.push('/admin')
                }}
                className="py-2 px-3 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Admin
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('token', 'bypass-owner-' + Date.now())
                  localStorage.setItem('user', JSON.stringify({
                    id: 'owner-bypass',
                    name: 'Owner Bypass',
                    email: 'owner@bypass.com',
                    role: 'OWNER',
                    tenant: { id: 'bypass-tenant', name: 'Bypass Tenant', slug: 'bypass' }
                  }))
                  router.push('/dashboard')
                }}
                className="py-2 px-3 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Owner
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('token', 'bypass-staff-' + Date.now())
                  localStorage.setItem('user', JSON.stringify({
                    id: 'staff-bypass',
                    name: 'Staff Bypass',
                    email: 'staff@bypass.com',
                    role: 'STAFF',
                    tenant: { id: 'bypass-tenant', name: 'Bypass Tenant', slug: 'bypass' }
                  }))
                  router.push('/dashboard')
                }}
                className="py-2 px-3 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Staff
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('token', 'bypass-customer-' + Date.now())
                  localStorage.setItem('user', JSON.stringify({
                    id: 'customer-bypass',
                    name: 'Customer Bypass',
                    email: 'customer@bypass.com',
                    role: 'CUSTOMER',
                    tenant: { id: 'bypass-tenant', name: 'Bypass Tenant', slug: 'bypass' }
                  }))
                  router.push('/')
                }}
                className="py-2 px-3 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
              >
                Customer
              </button>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              Não tem uma conta?
            </p>
            <div className="space-y-2 mt-2">
              <Link 
                href="/auth/register/customer"
                className="block w-full py-2 px-4 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 text-center"
              >
                Sou Cliente
              </Link>
              <Link 
                href="/auth/register/restaurant"
                className="block w-full py-2 px-4 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 text-center"
              >
                Tenho Restaurante
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}