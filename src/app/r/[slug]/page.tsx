'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus, Clock, MapPin, Phone, Star, ArrowLeft, Utensils } from 'lucide-react'

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
      <div>Test</div>
    </div>
  )
}
