"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function OrderForm() {
  const [customerId, setCustomerId] = useState('')
  const [restaurantId, setRestaurantId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with /api/orders
    console.log('create order', { customerId, restaurantId })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer">Cliente</Label>
        <Input id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="restaurant">Restaurante</Label>
        <Input id="restaurant" value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} />
      </div>
      <Button type="submit">Criar pedido</Button>
    </form>
  )
}

