'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, Clock, MapPin } from 'lucide-react'

interface Restaurant {
  id: string
  name: string
  slug: string
  address: any
  openingHours: any
  acceptingOrders: boolean
  deliveryFee: number
  minimumOrder: number
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

export default function MenuPage() {
  const params = useParams()
  const restaurantSlug = params.restaurantSlug as string
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [customization, setCustomization] = useState<{ [groupId: string]: string[] }>({})

  useEffect(() => {
    loadRestaurant()
  }, [restaurantSlug])

  const loadRestaurant = async () => {
    try {
      const response = await fetch(`/api/restaurants?slug=${restaurantSlug}`)
      if (response.ok) {
        const data = await response.json()
        setRestaurant(data)
      }
    } catch (error) {
      console.error('Error loading restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    setSelectedProduct(product)
    setCustomization({})
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
        const selectedCount = optionIds.length
        const paidCount = Math.max(0, selectedCount - freeQuota)
        
        optionIds.forEach(optionId => {
          const option = group.optionGroup.options.find(opt => opt.id === optionId)
          if (option) {
            const isPaid = optionIds.indexOf(optionId) >= freeQuota
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

    setCart(prev => [...prev, cartItem])
    setSelectedProduct(null)
    setCustomization({})
  }

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter((_, i) => i !== index))
    } else {
      setCart(prev => prev.map((item, i) => 
        i === index ? { ...item, quantity } : item
      ))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
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
          <h1 className="text-2xl font-bold text-foreground">Restaurante não encontrado</h1>
          <p className="text-muted-foreground">O restaurante que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{restaurant.name}</h1>
              <div className="flex items-center text-sm text-muted-foreground mt-1 space-x-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>Abre às {restaurant.openingHours?.from}</span>
                <span>•</span>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{restaurant.address?.city}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="text-foreground">
                  {restaurant.acceptingOrders ? 'Aberto' : 'Fechado'}
                </span>
              </div>
              <Button className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground min-w-[20px] h-5 flex items-center justify-center text-xs">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
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
            {restaurant.categories.map((category) => (
              <div key={category.id} className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">{category.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.products.map((product) => (
                    <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
                            <CardDescription className="mt-1 text-muted-foreground">
                              {product.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-foreground">
                              R$ {Number(product.basePrice).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          onClick={() => addToCart(product)}
                          className="w-full"
                          disabled={!restaurant.acceptingOrders}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar ao Carrinho
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Carrinho
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <CardContent className="text-center py-4">
                    <p className="text-muted-foreground">Carrinho vazio</p>
                  </CardContent>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.basePrice.toFixed(2)} cada
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
                          <span className="w-8 text-center text-foreground">{item.quantity}</span>
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
                      <div className="flex justify-between items-center text-lg font-bold text-foreground">
                        <span>Total:</span>
                        <span>R$ {getCartTotal().toFixed(2)}</span>
                      </div>
                      <Button className="w-full mt-4" size="lg">
                        Finalizar Pedido
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
              <CardTitle className="flex items-center text-foreground">
                {selectedProduct.name}
                <Badge variant="outline" className="ml-2 text-primary border-primary">
                  R$ {Number(selectedProduct.basePrice).toFixed(2)}
                </Badge>
              </CardTitle>
              <CardDescription className="text-muted-foreground">{selectedProduct.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedProduct.productOptionGroups.map((pog) => (
                <div key={pog.optionGroup.id}>
                  <h4 className="font-medium mb-2 text-foreground">
                    {pog.optionGroup.name}
                    {pog.optionGroup.required && (
                      <span className="ml-1 text-muted-foreground text-xs">(Obrigatório)</span>
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Escolha suas opções:
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
                        <span className="flex-1 text-foreground">{option.name}</span>
                        {Number(option.priceDelta) > 0 && (
                          <span className="text-sm text-muted-foreground">
                            + R$ {Number(option.priceDelta).toFixed(2)}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold text-foreground">
                  R$ {calculateItemPrice(selectedProduct, customization).toFixed(2)}
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
