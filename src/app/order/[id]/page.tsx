'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Circle, 
  Truck,
  Utensils,
  Package
} from 'lucide-react'

interface Order {
  id: string
  status: string
  fulfillment: string
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  createdAt: string
  customer: {
    name: string
    phone?: string
    email?: string
  }
  restaurant: {
    name: string
    address: any
  }
  orderItems: OrderItem[]
  orderEvents: OrderEvent[]
}

interface OrderItem {
  id: string
  productName: string
  unitPrice: number
  quantity: number
  observations?: string
  orderItemOptions: OrderItemOption[]
}

interface OrderItemOption {
  id: string
  groupNameSnapshot: string
  optionNameSnapshot: string
  priceDeltaApplied: number
  quantity: number
}

interface OrderEvent {
  id: string
  fromStatus?: string
  toStatus: string
  notes?: string
  ts: string
}

const statusConfig = {
  PENDING: {
    label: 'Aguardando Confirmação',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    description: 'Seu pedido foi recebido e está aguardando confirmação do restaurante'
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    description: 'Pedido confirmado pelo restaurante'
  },
  PREPARING: {
    label: 'Em Preparo',
    color: 'bg-orange-100 text-orange-800',
    icon: Utensils,
    description: 'Seu pedido está sendo preparado'
  },
  OUT_FOR_DELIVERY: {
    label: 'Saiu para Entrega',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
    description: 'Seu pedido saiu para entrega'
  },
  DELIVERED: {
    label: 'Entregue',
    color: 'bg-green-100 text-green-800',
    icon: Package,
    description: 'Pedido entregue com sucesso'
  },
  CANCELED: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: Circle,
    description: 'Pedido foi cancelado'
  }
}

const statusOrder = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default function OrderTrackingPage() {
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadOrder()
  }, [orderId])

  const loadOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Token de autenticação não encontrado')
        return
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao carregar pedido')
      }
    } catch (error) {
      console.error('Error loading order:', error)
      setError('Erro ao carregar pedido')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: string) => {
    return statusOrder.indexOf(status)
  }

  const getCurrentStatusIndex = () => {
    if (!order) return -1
    return getStatusIndex(order.status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pedido...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pedido não encontrado</h1>
          <p className="text-gray-600">O pedido que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = getCurrentStatusIndex()
  const statusConfig_current = statusConfig[order.status as keyof typeof statusConfig]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Acompanhar Pedido</h1>
          <p className="text-gray-600 mt-2">Pedido #{order.id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Status */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <statusConfig_current.icon className="h-5 w-5 mr-2" />
                  Status do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Badge className={statusConfig_current.color}>
                    {statusConfig_current.label}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-6">{statusConfig_current.description}</p>

                {/* Status Timeline */}
                <div className="space-y-4">
                  {statusOrder.map((status, index) => {
                    const config = statusConfig[status as keyof typeof statusConfig]
                    const isCompleted = index <= currentStatusIndex
                    const isCurrent = index === currentStatusIndex
                    
                    return (
                      <div key={status} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted 
                            ? 'bg-orange-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <config.icon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <p className={`font-medium ${
                            isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {config.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-gray-500">{config.description}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
                        {item.observations && (
                          <p className="text-sm text-gray-500 mt-1">
                            Obs: {item.observations}
                          </p>
                        )}
                        {item.orderItemOptions.length > 0 && (
                          <div className="mt-2">
                            {item.orderItemOptions.map((option) => (
                              <div key={option.id} className="text-sm text-gray-600">
                                <span className="font-medium">{option.groupNameSnapshot}:</span>
                                <span className="ml-1">{option.optionNameSnapshot}</span>
                                {option.priceDeltaApplied > 0 && (
                                  <span className="ml-1 text-green-600">
                                    (+{formatCurrency(option.priceDeltaApplied)})
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Detalhes do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Restaurante</h4>
                  <p className="text-gray-600">{order.restaurant.name}</p>
                  <p className="text-sm text-gray-500">
                    {order.restaurant.address?.street}, {order.restaurant.address?.number}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tipo de Entrega</h4>
                  <div className="flex items-center">
                    {order.fulfillment === 'delivery' ? (
                      <>
                        <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                        <span>Entrega</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        <span>Retirada</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pagamento</h4>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Resumo</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Taxa de entrega:</span>
                        <span>{formatCurrency(order.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                    <p className="text-sm text-gray-600">{order.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Data do Pedido</h4>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => window.history.back()}
                >
                  Voltar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
