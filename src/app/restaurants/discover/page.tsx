'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  MapPin,
  Clock,
  Star,
  Truck,
  Store,
  Filter,
  ArrowRight
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
  }
  deliveryFee: number
  minimumOrder: number
  deliveryRadiusKm: number
  acceptingOrders: boolean
  pickupEnabled: boolean
  openingHours: any
  categories: Array<{
    id: string
    name: string
    products: Array<{
      id: string
      name: string
      basePrice: number
    }>
  }>
}

export default function DiscoverRestaurantsPage() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    try {
      // This would be a public API endpoint to discover restaurants
      const response = await fetch('/api/restaurants/discover')
      
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
      } else {
        // Mock data for demonstration
        setRestaurants([
          {
            id: '1',
            name: 'Pizzaria do João',
            slug: 'pizzaria-do-joao',
            address: {
              street: 'Rua das Flores',
              number: '123',
              neighborhood: 'Centro',
              city: 'São Paulo',
              state: 'SP'
            },
            deliveryFee: 5.0,
            minimumOrder: 25.0,
            deliveryRadiusKm: 5.0,
            acceptingOrders: true,
            pickupEnabled: true,
            openingHours: {
              monday: { open: '18:00', close: '23:00' },
              tuesday: { open: '18:00', close: '23:00' },
              wednesday: { open: '18:00', close: '23:00' },
              thursday: { open: '18:00', close: '23:00' },
              friday: { open: '18:00', close: '23:00' },
              saturday: { open: '18:00', close: '23:00' },
              sunday: { open: '18:00', close: '23:00' }
            },
            categories: [
              {
                id: '1',
                name: 'Pizzas',
                products: [
                  { id: '1', name: 'Pizza Margherita', basePrice: 35.0 },
                  { id: '2', name: 'Pizza Pepperoni', basePrice: 40.0 }
                ]
              }
            ]
          },
          {
            id: '2',
            name: 'Hamburgueria Artesanal',
            slug: 'hamburgueria-artesanal',
            address: {
              street: 'Av. Paulista',
              number: '456',
              neighborhood: 'Bela Vista',
              city: 'São Paulo',
              state: 'SP'
            },
            deliveryFee: 3.0,
            minimumOrder: 30.0,
            deliveryRadiusKm: 3.0,
            acceptingOrders: false,
            pickupEnabled: true,
            openingHours: {
              monday: { open: '11:00', close: '22:00' },
              tuesday: { open: '11:00', close: '22:00' },
              wednesday: { open: '11:00', close: '22:00' },
              thursday: { open: '11:00', close: '22:00' },
              friday: { open: '11:00', close: '22:00' },
              saturday: { open: '11:00', close: '22:00' },
              sunday: { open: '11:00', close: '22:00' }
            },
            categories: [
              {
                id: '2',
                name: 'Hambúrgueres',
                products: [
                  { id: '3', name: 'Burger Clássico', basePrice: 25.0 },
                  { id: '4', name: 'Burger Bacon', basePrice: 30.0 }
                ]
              }
            ]
          },
          {
            id: '3',
            name: 'Sushi Express',
            slug: 'sushi-express',
            address: {
              street: 'Rua da Liberdade',
              number: '789',
              neighborhood: 'Liberdade',
              city: 'São Paulo',
              state: 'SP'
            },
            deliveryFee: 8.0,
            minimumOrder: 50.0,
            deliveryRadiusKm: 8.0,
            acceptingOrders: true,
            pickupEnabled: false,
            openingHours: {
              monday: { open: '17:00', close: '23:30' },
              tuesday: { open: '17:00', close: '23:30' },
              wednesday: { open: '17:00', close: '23:30' },
              thursday: { open: '17:00', close: '23:30' },
              friday: { open: '17:00', close: '23:30' },
              saturday: { open: '17:00', close: '23:30' },
              sunday: { open: '17:00', close: '23:30' }
            },
            categories: [
              {
                id: '3',
                name: 'Sushi',
                products: [
                  { id: '5', name: 'Combo Salmão', basePrice: 45.0 },
                  { id: '6', name: 'Temaki Especial', basePrice: 18.0 }
                ]
              }
            ]
          }
        ])
      }
    } catch (error) {
      console.error('Error loading restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const isRestaurantOpen = (restaurant: Restaurant) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()]
    const todayHours = restaurant.openingHours[today]
    
    if (!todayHours || todayHours.closed) return false
    
    const currentTime = getCurrentTime()
    return currentTime >= todayHours.open && currentTime <= todayHours.close
  }

  const getMinPrice = (restaurant: Restaurant) => {
    const allProducts = restaurant.categories.flatMap(cat => cat.products)
    if (allProducts.length === 0) return 0
    return Math.min(...allProducts.map(p => p.basePrice))
  }

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.categories.some(cat => 
                           cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cat.products.some(prod => prod.name.toLowerCase().includes(searchTerm.toLowerCase()))
                         )
    
    const matchesLocation = !locationFilter || 
                           restaurant.address.neighborhood.toLowerCase().includes(locationFilter.toLowerCase()) ||
                           restaurant.address.city.toLowerCase().includes(locationFilter.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'open' && restaurant.acceptingOrders && isRestaurantOpen(restaurant)) ||
                         (statusFilter === 'closed' && (!restaurant.acceptingOrders || !isRestaurantOpen(restaurant)))
    
    return matchesSearch && matchesLocation && matchesStatus
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
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Descubra Restaurantes</h1>
              <p className="text-gray-600 mt-1">Encontre os melhores sabores da sua região</p>
            </div>
            <div className="flex space-x-2">
              {localStorage.getItem('token') && (
                <Button variant="outline" onClick={() => router.push('/profile')}>
                  Meu Perfil
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/')}>
                Voltar ao início
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes, pratos ou categorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Bairro ou cidade..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todos</option>
                <option value="open">Abertos</option>
                <option value="closed">Fechados</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredRestaurants.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum restaurante encontrado</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || locationFilter || statusFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Não há restaurantes disponíveis no momento.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const isOpen = isRestaurantOpen(restaurant)
              const canOrder = restaurant.acceptingOrders && isOpen
              const minPrice = getMinPrice(restaurant)
              
              return (
                <Card 
                  key={restaurant.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/r/${restaurant.slug}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl text-gray-900">{restaurant.name}</CardTitle>
                      <Badge 
                        className={canOrder 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      >
                        {canOrder ? 'Aberto' : 'Fechado'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{restaurant.address.neighborhood}, {restaurant.address.city}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {Object.values(restaurant.openingHours)[0]?.open} - {Object.values(restaurant.openingHours)[0]?.close}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Categories preview */}
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Categorias:</p>
                        <div className="flex flex-wrap gap-1">
                          {restaurant.categories.slice(0, 3).map((category) => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                              {category.name}
                            </Badge>
                          ))}
                          {restaurant.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{restaurant.categories.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Pricing and delivery info */}
                      <div className="flex justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1" />
                          <span>R$ {restaurant.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div>
                          Mín: R$ {restaurant.minimumOrder.toFixed(2)}
                        </div>
                        {minPrice > 0 && (
                          <div>
                            A partir de R$ {minPrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      {/* Action button */}
                      <Button className="w-full" disabled={!canOrder}>
                        <span className="flex items-center justify-center">
                          {canOrder ? 'Ver Cardápio' : 'Restaurante Fechado'}
                          {canOrder && <ArrowRight className="h-4 w-4 ml-2" />}
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
