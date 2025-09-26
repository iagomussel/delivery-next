import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, Users, ShoppingCart, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-orange-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">DeliveryNext</h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Plataforma de Delivery
            <span className="text-orange-600"> Multi-tenant</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema completo para restaurantes venderem via delivery sem processar pagamentos.
            Gerencie cardápios, pedidos, opcionais e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Começar Agora
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h3>
            <p className="text-lg text-gray-600">
              Tudo que você precisa para gerenciar seu delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Store className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Gestão de Restaurantes</CardTitle>
                <CardDescription>
                  Multi-tenant com gestão completa de restaurantes, horários e áreas de entrega
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Cardápio Inteligente</CardTitle>
                <CardDescription>
                  Produtos com opcionais, adicionais e regras de preço flexíveis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Controle de Acesso</CardTitle>
                <CardDescription>
                  RBAC com diferentes níveis: dono, funcionário, afiliado e admin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Analytics completos de vendas, conversões e performance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Como Funciona
            </h3>
            <p className="text-lg text-gray-600">
              Processo simples e eficiente para seus clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Cliente Navega</h4>
              <p className="text-gray-600">
                Cliente acessa o cardápio, escolhe produtos e personaliza com opcionais
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Faz o Pedido</h4>
              <p className="text-gray-600">
                Seleciona endereço, forma de pagamento presencial e envia o pedido
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Restaurante Processa</h4>
              <p className="text-gray-600">
                Funcionários recebem, preparam e entregam com acompanhamento em tempo real
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Pronto para Começar?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Cadastre seu restaurante e comece a vender online hoje mesmo
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Cadastrar Restaurante
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-orange-600" />
              <h4 className="ml-2 text-2xl font-bold">DeliveryNext</h4>
            </div>
            <p className="text-gray-400">
              © 2024 DeliveryNext. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}