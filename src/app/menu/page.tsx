'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Package,
  Edit,
  DollarSign,
  Tag
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  description?: string
  order: number
  isActive: boolean
  productCount: number
  createdAt: string
}

interface Product {
  id: string
  name: string
  description: string
  basePrice: number
  imageUrl?: string
  isActive: boolean
  categoryId: string
  categoryName: string
  createdAt: string
}

export default function MenuManagementPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories')
  const router = useRouter()

  useEffect(() => {
    loadMenuData()
  }, [])

  const loadMenuData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Load categories
      const categoriesResponse = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      // Load products
      const productsResponse = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      } else {
        console.error('Failed to load categories')
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      } else {
        console.error('Failed to load products')
      }
    } catch (error) {
      console.error('Error loading menu data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo'
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && category.isActive) ||
      (statusFilter === 'inactive' && !category.isActive)
    return matchesSearch && matchesStatus
  })

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) ||
      (statusFilter === 'inactive' && !product.isActive)
    return matchesSearch && matchesCategory && matchesStatus
  })

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
                <h1 className="text-2xl font-bold text-foreground">Gerenciar Cardápio</h1>
                <p className="text-sm text-muted-foreground">Visualize e edite suas categorias e produtos</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/categories/create')}>
                <Tag className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
              <Button onClick={() => router.push('/products/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                Categorias ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
                }`}
              >
                Produtos ({products.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={activeTab === 'categories' ? 'Buscar categorias...' : 'Buscar produtos...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {activeTab === 'products' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'categories' ? (
          <div className="space-y-4">
            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma categoria encontrada</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Comece criando sua primeira categoria.'
                    }
                  </p>
                  <Button onClick={() => router.push('/categories/create')}>
                    <Tag className="h-4 w-4 mr-2" />
                    Criar Primeira Categoria
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {category.name}
                          </h3>
                          <Badge className={getStatusColor(category.isActive)}>
                            {getStatusText(category.isActive)}
                          </Badge>
                        </div>
                        {category.description && (
                          <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Package className="h-4 w-4 mr-1" />
                          {category.productCount} produtos
                          <span className="mx-2">•</span>
                          Ordem: {category.order}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/categories/${category.id}/edit`)}
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
        ) : (
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Comece criando seu primeiro produto.'
                    }
                  </p>
                  <Button onClick={() => router.push('/products/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Produto
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {product.name}
                          </h3>
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(product.isActive)}>
                              {getStatusText(product.isActive)}
                            </Badge>
                            <Badge variant="outline">
                              {product.categoryName}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 mr-1" />
                          R$ {product.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/products/${product.id}/edit`)}
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
        )}
      </main>
    </div>
  )
}
