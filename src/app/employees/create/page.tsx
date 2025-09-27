'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'

export default function EmployeeCreatePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STAFF')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao criar funcionário')
      }
      router.push('/employees')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><UserPlus className="h-5 w-5 mr-2"/>Novo Funcionário</CardTitle>
            <CardDescription>Crie um usuário de equipe para seu estabelecimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-destructive">{error}</div>}
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Cargo</Label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="STAFF">Funcionário</option>
                  <option value="OWNER">Proprietário</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="AFFILIATE">Afiliado</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Criar'}</Button>
                <Button type="button" variant="outline" onClick={() => router.push('/employees')}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

