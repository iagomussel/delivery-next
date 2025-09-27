"use client"
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AddressForm() {
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: integrate with /api/addresses
    console.log('save address', { street, number, city, zip })
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="street">Rua</Label>
        <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">Número</Label>
        <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="zip">CEP</Label>
        <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  )
}

