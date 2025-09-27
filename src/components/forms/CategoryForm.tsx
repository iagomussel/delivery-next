"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function CategoryForm({ categoryId }: { categoryId?: string }) {
  const [name, setName] = useState('')
  const [order, setOrder] = useState<number | ''>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with /api/categories
    console.log('submit', { categoryId, name, order })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Ordem</Label>
        <Input id="order" type="number" value={order} onChange={(e) => setOrder(e.target.value ? Number(e.target.value) : '')} />
      </div>
      <Button type="submit">Salvar</Button>
    </form>
  )
}

