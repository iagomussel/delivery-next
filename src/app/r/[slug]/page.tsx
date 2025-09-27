'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, Clock, MapPin, Phone, Star, ArrowLeft } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  slug: string
  address: any
  openingHours: any
  acceptingOrders: boolean
  deliveryFee: number
  minimumOrder: number
  deliveryRadiusKm: number
  pickupEnabled: boolean
  categories: Category[]
}

interface Category {
  id: string
  name: string
  order: number
  products: Product[]
}

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  imageUrl?: string
  productOptionGroups: ProductOptionGroup[]
}

interface ProductOptionGroup {
  optionGroup: {
    id: string
    name: string
    required: boolean
    minSelect: number
    maxSelect: number
    freeQuota: number
    options: Option[]
  }
}

interface Option {
  id: string
  name: string
  priceDelta: number
}

interface CartItem {
  productId: string
  productName: string
  basePrice: number
  quantity: number
  selectedOptions: { [groupId: string]: string[] }
  totalPrice: number
}

export default function PublicMenuPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantSlug = params.slug as string
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customization, setCustomization] = useState<{ [groupId: string]: string[] }>({})

  useEffect(() => {
    loadRestaurant()
    loadCartFromStorage()
  }, [restaurantSlug])

  const loadRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants?slug=${restaurantSlug}`)
      if (response.ok) {
        const data = await response.json()
        setRestaurant(data)
      } else {
        console.error('Restaurant not found')
      }
    } catch (error) {
      console.error('Error loading restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem(`cart_${restaurantSlug}`)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const saveCartToStorage = (newCart: CartItem[]) => {
    localStorage.setItem(`cart_${restaurantSlug}`, JSON.stringify(newCart))
  }

  const addToCart = (product: Product) => {
    if (product.productOptionGroups.length > 0) {
      setSelectedProduct(product)
      setCustomization({})
    } else {
      // Simple product without options
      const cartItem: CartItem = {
        productId: product.id,
        productName: product.name,
        basePrice: Number(product.basePrice),
        quantity: 1,
        selectedOptions: {},
        totalPrice: Number(product.basePrice)
      }
      
      const newCart = [...cart, cartItem]
      setCart(newCart)
      saveCartToStorage(newCart)
    }
  }

  const handleOptionChange = (groupId: string, optionId: string, checked: boolean) => {
    setCustomization(prev => {
      const current = prev[groupId] || []
      if (checked) {
        return { ...prev, [groupId]: [...current, optionId] }
      } else {
        return { ...prev, [groupId]: current.filter(id => id !== optionId) }
      }
    })
  }

  const calculateItemPrice = (product: Product, selectedOptions: { [groupId: string]: string[] }) => {
    let total = Number(product.basePrice)
    
    Object.entries(selectedOptions).forEach(([groupId, optionIds]) => {
      const group = product.productOptionGroups.find(pog => pog.optionGroup.id === groupId)
      if (group) {
        const freeQuota = group.optionGroup.freeQuota
        
        optionIds.forEach((optionId, index) => {
          const option = group.optionGroup.options.find(opt => opt.id === optionId)
          if (option) {
            const isPaid = index >= freeQuota
            if (isPaid) {
              total += Number(option.priceDelta)
            }
          }
        })
      }
    })
    
    return total
  }

  const addItemToCart = () => {
    if (!selectedProduct) return

    const totalPrice = calculateItemPrice(selectedProduct, customization)
    
    const cartItem: CartItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      basePrice: Number(selectedProduct.basePrice),
      quantity: 1,
      selectedOptions: customization,
      totalPrice
    }

    const newCart = [...cart, cartItem]
    setCart(newCart)
    saveCartToStorage(newCart)
    setSelectedProduct(null)
    setCustomization({})
  }

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      const newCart = cart.filter((_, i) => i !== index)
      setCart(newCart)
      saveCartToStorage(newCart)
    } else {
      const newCart = cart.map((item, i) => 
        i === index ? { ...item, quantity } : item
      )
      setCart(newCart)
      saveCartToStorage(newCart)
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 5)
  }

  const isRestaurantOpen = () => {
    if (!restaurant) return false
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()]
    const todayHours = restaurant.openingHours[today]
    
    if (!todayHours || todayHours.closed) return false
    
    const currentTime = getCurrentTime()
    return currentTime >= todayHours.open && currentTime <= todayHours.close
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    
    // Save cart and redirect to order creation
    localStorage.setItem('checkout_cart', JSON.stringify({
      restaurantId: restaurant?.id,
      restaurantName: restaurant?.name,
      items: cart
    }))
    
    router.push('/order/create')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurante não encontrado</h1>
          <p className="text-gray-600 mb-4">O restaurante que você está procurando não existe.</p>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    )
  }

  const isOpen = isRestaurantOpen()
  const canOrder = restaurant.acceptingOrders && isOpen

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
              <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address?.street}, {restaurant.address?.number}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
                    {isOpen ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
                {restaurant.deliveryFee > 0 && (
                  <div className="text-gray-600">
                    Taxa de entrega: R$ {restaurant.deliveryFee.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {!canOrder && (
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {!isOpen ? 'Fechado' : 'Não aceitando pedidos'}
                </Badge>
              )}
              <Button 
                className="relative" 
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-orange-600 text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            {restaurant.categories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Cardápio em construção</h3>
                  <p className="text-gray-600">Este restaurante ainda está organizando seu cardápio.</p>
                </CardContent>
              </Card>
            ) : (
              restaurant.categories.map((category) => (
                <div key={category.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{category.name}</h2>
                  {category.products.length === 0 ? (
                    <p className="text-gray-600 mb-4">Nenhum produto disponível nesta categoria.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.products.map((product) => (
                        <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900">{product.name}</CardTitle>
                                <CardDescription className="mt-1 text-gray-600">
                                  {product.description}
                                </CardDescription>
                              </div>
                              {product.imageUrl && (
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-16 h-16 object-cover rounded ml-4"
                                />
                              )}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-lg font-bold text-orange-600">
                                R$ {Number(product.basePrice).toFixed(2)}
                              </span>
                              <Button 
                                onClick={() => addToCart(product)}
                                disabled={!canOrder}
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrinho
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">Carrinho vazio</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-sm text-gray-600">
                            R$ {item.totalPrice.toFixed(2)} cada
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                        <span>Total:</span>
                        <span>R$ {getCartTotal().toFixed(2)}</span>
                      </div>
                      {restaurant.minimumOrder > 0 && getCartTotal() < restaurant.minimumOrder && (
                        <p className="text-sm text-red-600 mt-2">
                          Pedido mínimo: R$ {restaurant.minimumOrder.toFixed(2)}
                        </p>
                      )}
                      <Button 
                        className="w-full mt-4" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={!canOrder || (restaurant.minimumOrder > 0 && getCartTotal() < restaurant.minimumOrder)}
                      >
                        {!canOrder ? 'Restaurante fechado' : 'Finalizar Pedido'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-gray-900">{selectedProduct.name}</CardTitle>
              <CardDescription className="text-gray-600">{selectedProduct.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedProduct.productOptionGroups.map((pog) => (
                <div key={pog.optionGroup.id}>
                  <h4 className="font-medium mb-2 text-gray-900">
                    {pog.optionGroup.name}
                    {pog.optionGroup.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {pog.optionGroup.minSelect > 0 && `Mínimo: ${pog.optionGroup.minSelect}`}
                    {pog.optionGroup.maxSelect > 0 && ` | Máximo: ${pog.optionGroup.maxSelect}`}
                    {pog.optionGroup.freeQuota > 0 && ` | Grátis: ${pog.optionGroup.freeQuota}`}
                  </p>
                  <div className="space-y-2">
                    {pog.optionGroup.options.map((option) => (
                      <label key={option.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={customization[pog.optionGroup.id]?.includes(option.id) || false}
                          onChange={(e) => handleOptionChange(pog.optionGroup.id, option.id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="flex-1 text-gray-900">{option.name}</span>
                        {option.priceDelta > 0 && (
                          <span className="text-sm text-gray-600">
                            +R$ {Number(option.priceDelta).toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold text-gray-900">
                  Total: R$ {calculateItemPrice(selectedProduct, customization).toFixed(2)}
                </span>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={addItemToCart}>
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
