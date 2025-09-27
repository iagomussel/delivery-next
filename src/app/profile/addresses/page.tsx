'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Address {
  id: string
  label: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zip: string
  notes?: string
}

export default function ProfileAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Address>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/addresses?me=true', { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) setAddresses(await res.json())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const created = await res.json()
        setAddresses(prev => [created, ...prev])
        setForm({})
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Meus Endereços</h1>

        <Card>
          <CardHeader>
            <CardTitle>Adicionar Endereço</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Rótulo</Label>
                <Input value={form.label || ''} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))} />
              </div>
              <div>
                <Label>Rua</Label>
                <Input value={form.street || ''} onChange={(e) => setForm(p => ({ ...p, street: e.target.value }))} required />
              </div>
              <div>
                <Label>Número</Label>
                <Input value={form.number || ''} onChange={(e) => setForm(p => ({ ...p, number: e.target.value }))} required />
              </div>
              <div>
                <Label>Bairro</Label>
                <Input value={form.neighborhood || ''} onChange={(e) => setForm(p => ({ ...p, neighborhood: e.target.value }))} required />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input value={form.city || ''} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} required />
              </div>
              <div>
                <Label>Estado</Label>
                <Input value={form.state || ''} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} required />
              </div>
              <div>
                <Label>CEP</Label>
                <Input value={form.zip || ''} onChange={(e) => setForm(p => ({ ...p, zip: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Complemento</Label>
                <Input value={form.notes || ''} onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={saving}>Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {addresses.map(addr => (
            <Card key={addr.id}>
              <CardContent className="py-4">
                <div className="font-medium text-foreground">{addr.label || 'Endereço'}</div>
                <div className="text-sm text-muted-foreground">
                  {addr.street}, {addr.number} - {addr.neighborhood}, {addr.city}/{addr.state} {addr.zip}
                </div>
                {addr.notes && <div className="text-sm text-muted-foreground">{addr.notes}</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

