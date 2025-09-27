'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Store,
  MapPin,
  Clock,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  slug: string
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
  }
  openingHours: any
  acceptingOrders: boolean
  deliveryFee: number
  minimumOrder: number
  deliveryRadiusKm: number
  pickupEnabled: boolean
  createdAt: string
  updatedAt: string
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      } else {
        console.error('Failed to load restaurants')
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (acceptingOrders: boolean) => {
    return acceptingOrders 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (acceptingOrders: boolean) => {
    return acceptingOrders ? 'Aceitando Pedidos' : 'Fechado'
  }

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'open' && restaurant.acceptingOrders) ||
      (statusFilter === 'closed' && !restaurant.acceptingOrders)
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando restaurantes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Restaurantes</h1>
                <p className="text-sm text-gray-600">Gerencie seus restaurantes</p>
              </div>
            </div>
            <Button onClick={() => router.push('/restaurants/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Restaurante
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por nome, cidade ou bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todos os status</option>
              <option value="open">Aceitando pedidos</option>
              <option value="closed">Fechado</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Restaurants List */}
        <div className="space-y-4">
          {filteredRestaurants.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Store className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum restaurante encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece criando seu primeiro restaurante.'
                  }
                </p>
                <Button onClick={() => router.push('/restaurants/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Restaurante
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {restaurant.name}
                        </h3>
                        <Badge className={getStatusColor(restaurant.acceptingOrders)}>
                          {getStatusText(restaurant.acceptingOrders)}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {restaurant.address.street}, {restaurant.address.number} - {restaurant.address.neighborhood}
                        </p>
                        <p className="text-sm text-gray-600">
                          {restaurant.address.city}, {restaurant.address.state}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Taxa de entrega: R$ {restaurant.deliveryFee.toFixed(2)}
                        </div>
                        <div className="flex items-center">
                          <Store className="h-4 w-4 mr-1" />
                          Pedido mínimo: R$ {restaurant.minimumOrder.toFixed(2)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Raio: {restaurant.deliveryRadiusKm}km
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/menu/${restaurant.slug}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Menu
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/restaurants/${restaurant.id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
