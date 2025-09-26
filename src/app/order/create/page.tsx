'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectItem } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { MapPin, Clock, CreditCard, Smartphone, Banknote } from 'lucide-react'

interface Customer {
  id: string
  name: string
  phone?: string
  email?: string
  addresses: Address[]
}

interface Address {
  id: string
  label: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zip: string
  lat?: number
  lng?: number
  notes?: string
}

interface CartItem {
  productId: string
  productName: string
  basePrice: number
  quantity: number
  selectedOptions: { [groupId: string]: string[] }
  totalPrice: number
}

export default function CreateOrderPage() {
  const router = useRouter()
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCustomerData()
    loadCartFromStorage()
  }, [])

  const loadCustomerData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/customers/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCustomer(data)
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading customer data:', error)
    }
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }

  const calculateDeliveryFee = () => {
    return fulfillment === 'delivery' ? 5.0 : 0
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const restaurantId = localStorage.getItem('selectedRestaurantId')
      
      if (!token || !restaurantId) {
        alert('Dados de sessão inválidos')
        return
      }

      const orderData = {
        restaurantId,
        customerId: customer?.id,
        fulfillment,
        paymentMethod,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          options: Object.entries(item.selectedOptions).map(([groupId, optionIds]) => ({
            groupId,
            optionIds
          }))
        })),
        notes,
        addressId: selectedAddress
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        localStorage.removeItem('cart')
        router.push(`/order/${order.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar pedido')
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Pedido</h1>
          <p className="text-gray-600 mt-2">Revise seus dados e confirme o pedido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Dados do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={customer.name}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={customer.phone || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={customer.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Tipo de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={fulfillment}
                    onValueChange={(value) => setFulfillment(value as 'delivery' | 'pickup')}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex-1">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Entrega</span>
                        </div>
                        <p className="text-sm text-gray-500">Entregamos no seu endereço</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex-1">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Retirada</span>
                        </div>
                        <p className="text-sm text-gray-500">Retire no restaurante</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Address Selection */}
              {fulfillment === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedAddress}
                      onValueChange={setSelectedAddress}
                      placeholder="Selecione um endereço"
                    >
                      {customer.addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          <div>
                            <p className="font-medium">{address.label}</p>
                            <p className="text-sm text-gray-500">
                              {address.street}, {address.number} - {address.neighborhood}
                            </p>
                          </div>
                        </SelectItem>
                      ))}
                    </Select>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1">
                        <div className="flex items-center">
                          <Banknote className="h-4 w-4 mr-2" />
                          <span>Dinheiro</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix" className="flex-1">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2" />
                          <span>PIX</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit" className="flex-1">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Cartão de Débito</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex-1">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Cartão de Crédito</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                  <CardDescription>
                    Adicione observações para o seu pedido
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Sem cebola, ponto da carne bem passado..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        R$ {(item.totalPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>R$ {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {fulfillment === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Taxa de entrega:</span>
                        <span>R$ {calculateDeliveryFee().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
