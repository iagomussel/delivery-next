'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowLeft,
  Save,
  Settings,
  Store,
  MapPin,
  Clock,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Truck,
  Users,
  Bell,
  Shield,
  Palette
} from 'lucide-react'

interface RestaurantSettings {
  // Basic Info
  name: string
  description: string
  phone: string
  email: string
  website: string
  
  // Address
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
  }
  
  // Operating Hours
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  
  // Delivery Settings
  deliveryFee: number
  minimumOrder: number
  deliveryRadiusKm: number
  pickupEnabled: boolean
  acceptingOrders: boolean
  
  // Notifications
  emailNotifications: boolean
  smsNotifications: boolean
  orderNotifications: boolean
  
  // Display Settings
  theme: string
  language: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<RestaurantSettings>({
    name: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zip: ''
    },
    openingHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '08:00', close: '22:00', closed: false },
      sunday: { open: '08:00', close: '22:00', closed: false }
    },
    deliveryFee: 5.0,
    minimumOrder: 25.0,
    deliveryRadiusKm: 5.0,
    pickupEnabled: true,
    acceptingOrders: true,
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    theme: 'light',
    language: 'pt-BR'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/restaurants/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        console.error('Failed to load settings')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/restaurants/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Configurações salvas com sucesso!')
      } else {
        alert('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const updateSettings = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const updateAddress = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }))
  }

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value }
      }
    }))
  }

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
    return days[day] || day
  }

  const tabs = [
    { id: 'general', name: 'Geral', icon: Store },
    { id: 'address', name: 'Endereço', icon: MapPin },
    { id: 'hours', name: 'Horários', icon: Clock },
    { id: 'delivery', name: 'Entrega', icon: Truck },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'display', name: 'Aparência', icon: Palette }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
                <p className="text-sm text-gray-600">Gerencie as configurações do seu restaurante</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'general' && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais</CardTitle>
                  <CardDescription>
                    Configure as informações básicas do seu restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Restaurante</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => updateSettings('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) => updateSettings('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSettings('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSettings('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => updateSettings('website', e.target.value)}
                      placeholder="https://seurestaurante.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'address' && (
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>
                    Configure o endereço do seu restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input
                        id="street"
                        value={settings.address.street}
                        onChange={(e) => updateAddress('street', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        value={settings.address.number}
                        onChange={(e) => updateAddress('number', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={settings.address.neighborhood}
                      onChange={(e) => updateAddress('neighborhood', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={settings.address.city}
                        onChange={(e) => updateAddress('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={settings.address.state}
                        onChange={(e) => updateAddress('state', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">CEP</Label>
                      <Input
                        id="zip"
                        value={settings.address.zip}
                        onChange={(e) => updateAddress('zip', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'hours' && (
              <Card>
                <CardHeader>
                  <CardTitle>Horários de Funcionamento</CardTitle>
                  <CardDescription>
                    Configure os horários de funcionamento do seu restaurante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-32">
                        <Label>{getDayName(day)}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => updateOpeningHours(day, 'closed', !e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">Aberto</span>
                      </div>
                      {!hours.closed && (
                        <>
                          <div>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                              className="w-24"
                            />
                          </div>
                          <span className="text-gray-600">às</span>
                          <div>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                              className="w-24"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'delivery' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Entrega</CardTitle>
                  <CardDescription>
                    Configure as opções de entrega e retirada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
                      <Input
                        id="deliveryFee"
                        type="number"
                        step="0.01"
                        value={settings.deliveryFee}
                        onChange={(e) => updateSettings('deliveryFee', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimumOrder">Pedido Mínimo (R$)</Label>
                      <Input
                        id="minimumOrder"
                        type="number"
                        step="0.01"
                        value={settings.minimumOrder}
                        onChange={(e) => updateSettings('minimumOrder', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
                    <Input
                      id="deliveryRadius"
                      type="number"
                      step="0.1"
                      value={settings.deliveryRadiusKm}
                      onChange={(e) => updateSettings('deliveryRadiusKm', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.pickupEnabled}
                        onChange={(e) => updateSettings('pickupEnabled', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Permitir retirada no local</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.acceptingOrders}
                        onChange={(e) => updateSettings('acceptingOrders', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Aceitar novos pedidos</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>
                    Configure como você deseja receber notificações
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => updateSettings('emailNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Notificações por email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => updateSettings('smsNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Notificações por SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.orderNotifications}
                        onChange={(e) => updateSettings('orderNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Notificações de novos pedidos</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'display' && (
              <Card>
                <CardHeader>
                  <CardTitle>Aparência</CardTitle>
                  <CardDescription>
                    Configure a aparência e idioma da interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <select
                      id="theme"
                      value={settings.theme}
                      onChange={(e) => updateSettings('theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <select
                      id="language"
                      value={settings.language}
                      onChange={(e) => updateSettings('language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
