'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, Save } from 'lucide-react'

export default function EmployeeEditPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('STAFF')
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/employees/${id}`, { headers: { 'Authorization': `Bearer ${token}` }})
        if (!res.ok) throw new Error('Erro ao carregar funcionário')
        const data = await res.json()
        setName(data.name)
        setEmail(data.email)
        setRole(data.role)
        setActive(data.active)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/employees/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, role, active }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao salvar')
      }
      router.push('/employees')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Shield className="h-5 w-5 mr-2"/>Editar Funcionário</CardTitle>
            <CardDescription>Atualize as informações do membro da equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {error && <div className="text-destructive">{error}</div>}
              <div className="space-y-1">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly disabled />
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
              <div className="flex items-center gap-2">
                <input id="active" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                <Label htmlFor="active">Ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}><Save className="h-4 w-4 mr-1"/>Salvar</Button>
                <Button type="button" variant="outline" onClick={() => router.push('/employees')}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

