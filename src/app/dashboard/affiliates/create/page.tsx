"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'

export default function AffiliateCreatePage() {
  const [code, setCode] = useState('')
  const [rate, setRate] = useState('10')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch('/api/affiliates', {
        method: 'POST',
        body: JSON.stringify({ code, commissionRate: Number(rate) / 100 }),
      })
      router.push('/dashboard/affiliates')
    } catch (e) {
      console.error('Failed to create affiliate', e)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Novo Afiliado</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" placeholder="CODE10" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Taxa de comissão (%)</Label>
              <Input id="rate" type="number" min="0" max="100" value={rate} onChange={(e) => setRate(e.target.value)} required />
            </div>
            <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Criar'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
