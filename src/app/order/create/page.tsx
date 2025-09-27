'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, CreditCard, Smartphone, Banknote, ArrowLeft, Check } from 'lucide-react'

interface CartItem {
  productId: string
  productName: string
  basePrice: number
  quantity: number
  selectedOptions: { [groupId: string]: string[] }
  totalPrice: number
}

interface CheckoutData {
  restaurantId: string
  restaurantName: string
  items: CartItem[]
}

export default function CreateOrderPage() {
  const router = useRouter()
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<string>('cash')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zip: '',
    notes: ''
  })

  useEffect(() => {
    loadCheckoutData()
    loadUserData()
  }, [])

  const loadCheckoutData = () => {
    const savedData = localStorage.getItem('checkout_cart')
    if (savedData) {
      const data = JSON.parse(savedData)
      setCheckoutData(data)
    } else {
      // No checkout data, redirect to discover
      router.push('/restaurants/discover')
    }
  }

  const loadUserData = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setCustomerInfo({
        name: user.name || '',
        phone: '',
        email: user.email || ''
      })
    }
  }

  const calculateSubtotal = () => {
    if (!checkoutData) return 0
    return checkoutData.items.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }

  const calculateDeliveryFee = () => {
    return fulfillment === 'delivery' ? 5.0 : 0 // This should come from restaurant data
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const orderData = {
        restaurantId: checkoutData?.restaurantId,
        fulfillment: fulfillment.toUpperCase(),
        paymentMethod: paymentMethod.toUpperCase(),
        items: checkoutData?.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          options: [], // Convert selectedOptions if needed
          observations: ''
        })),
        notes,
        customerInfo,
        ...(fulfillment === 'delivery' && { deliveryAddress })
      }

      const response = await fetch('/api/orders/customer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Clear checkout data
        localStorage.removeItem('checkout_cart')
        
        // Redirect to order confirmation
        router.push(`/order/${result.order.id}?success=true`)
      } else {
        const error = await response.json()
        alert(`Erro ao criar pedido: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erro ao criar pedido')
    } finally {
      setLoading(false)
    }
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
              <p className="text-sm text-muted-foreground">{checkoutData.restaurantName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Details */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">Nome completo</Label>
                    <Input
                      id="customerName"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Telefone</Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fulfillment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                        checked={fulfillment === 'delivery'}
                        onChange={(e) => setFulfillment(e.target.value as 'delivery' | 'pickup')}
                        className="text-primary"
                      />
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <div className="font-medium text-foreground">Entrega</div>
                          <div className="text-sm text-muted-foreground">
                            Taxa: R$ {calculateDeliveryFee().toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked={fulfillment === 'pickup'}
                        onChange={(e) => setFulfillment(e.target.value as 'delivery' | 'pickup')}
                        className="text-primary"
                      />
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                        <div>
                          <div className="font-medium text-foreground">Retirada</div>
                          <div className="text-sm text-muted-foreground">
                            Retirar no restaurante
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {fulfillment === 'delivery' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="street">Rua</Label>
                        <Input
                          id="street"
                          value={deliveryAddress.street}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="number">Número</Label>
                        <Input
                          id="number"
                          value={deliveryAddress.number}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, number: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={deliveryAddress.neighborhood}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Estado</Label>
                        <Input
                          id="state"
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="addressNotes">Complemento</Label>
                      <Input
                        id="addressNotes"
                        value={deliveryAddress.notes}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Apartamento, bloco, referência..."
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Forma de Pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex items-center">
                        <Banknote className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-foreground">Dinheiro</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-foreground">PIX</span>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-primary"
                      />
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                        <span className="text-foreground">Cartão na entrega</span>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alguma observação especial para seu pedido..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {checkoutData.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {item.quantity}x {item.productName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            R$ {item.totalPrice.toFixed(2)} cada
                          </div>
                        </div>
                        <div className="font-medium text-foreground">
                          R$ {(item.totalPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>R$ {calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxa de entrega</span>
                      <span>R$ {calculateDeliveryFee().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-foreground border-t border-border pt-2">
                      <span>Total</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      'Finalizando...'
                    ) : (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Finalizar Pedido
                      </>
                    )}
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