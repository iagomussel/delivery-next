'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  X,
  Check
} from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'OWNER' | 'STAFF' | 'AFFILIATE' | 'ADMIN' | 'CUSTOMER'
  active: boolean
  createdAt: string
  lastLogin?: string
}

interface NewUserForm {
  name: string
  email: string
  password: string
  role: 'STAFF' | 'AFFILIATE'
}

export default function RestaurantUsersPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: '',
    email: '',
    password: '',
    role: 'STAFF'
  })
  const [addingUser, setAddingUser] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [restaurantId])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/restaurants/${restaurantId}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        console.error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddingUser(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/restaurants/${restaurantId}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(prev => [...prev, data])
        setNewUser({ name: '', email: '', password: '', role: 'STAFF' })
        setShowAddUser(false)
      } else {
        const error = await response.json()
        alert(`Erro ao adicionar usuário: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('Erro ao adicionar usuário')
    } finally {
      setAddingUser(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-red-100 text-red-800'
      case 'STAFF':
        return 'bg-blue-100 text-blue-800'
      case 'AFFILIATE':
        return 'bg-green-100 text-green-800'
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Proprietário'
      case 'STAFF':
        return 'Funcionário'
      case 'AFFILIATE':
        return 'Afiliado'
      case 'ADMIN':
        return 'Administrador'
      case 'CUSTOMER':
        return 'Cliente'
      default:
        return role
    }
  }

  const getStatusColor = (active: boolean) => {
    return active 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (active: boolean) => {
    return active ? 'Ativo' : 'Inativo'
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.active) ||
      (statusFilter === 'inactive' && !user.active)
    return matchesSearch && matchesRole && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
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
                onClick={() => router.push('/restaurants')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Usuários do Restaurante</h1>
                <p className="text-sm text-gray-600">Gerencie funcionários e permissões</p>
              </div>
            </div>
            <Button onClick={() => setShowAddUser(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Todos os cargos</option>
              <option value="OWNER">Proprietário</option>
              <option value="STAFF">Funcionário</option>
              <option value="AFFILIATE">Afiliado</option>
              <option value="ADMIN">Administrador</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Adicionar Usuário</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setShowAddUser(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Cargo</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as 'STAFF' | 'AFFILIATE' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STAFF">Funcionário</SelectItem>
                        <SelectItem value="AFFILIATE">Afiliado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={addingUser}>
                      {addingUser ? 'Adicionando...' : 'Adicionar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Tente ajustar os filtros de busca.' 
                    : 'Comece adicionando usuários ao restaurante.'
                  }
                </p>
                <Button onClick={() => setShowAddUser(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Usuário
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <div className="flex gap-2">
                          <Badge className={getRoleColor(user.role)}>
                            <Shield className="h-3 w-3 mr-1" />
                            {getRoleText(user.role)}
                          </Badge>
                          <Badge className={getStatusColor(user.active)}>
                            {getStatusText(user.active)}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-gray-600 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {user.email}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        Usuário desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        {user.lastLogin && (
                          <span className="ml-4">
                            Último acesso: {new Date(user.lastLogin).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/restaurants/${restaurantId}/users/${user.id}/edit`)}
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
