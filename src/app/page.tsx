import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Store, 
  Clock, 
  MapPin, 
  Star, 
  Smartphone, 
  CreditCard,
  Truck,
  Users,
  Shield,
  Search
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-orange-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">DeliveryNext</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/register/customer">
                <Button>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Comida deliciosa na sua porta
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra os melhores restaurantes da sua região e peça sua comida favorita 
            com entrega rápida e segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/restaurants/discover">
              <Button size="lg" className="text-lg px-8 py-4">
                <Search className="h-5 w-5 mr-2" />
                Descobrir Restaurantes
              </Button>
            </Link>
            <Link href="/auth/register/customer">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o DeliveryNext?
            </h2>
            <p className="text-lg text-gray-600">
              A melhor experiência de delivery da sua cidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Entrega Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Receba seu pedido em até 30 minutos. Acompanhe em tempo real.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Cobertura Total</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Entregamos em toda a cidade. Encontre restaurantes perto de você.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Star className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Qualidade Garantida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Restaurantes selecionados e avaliados pelos nossos clientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Fácil de Usar</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Interface simples e intuitiva. Faça seu pedido em poucos cliques.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Pagamento Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Pague com cartão, PIX ou dinheiro. Seus dados sempre protegidos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Suporte 24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Nossa equipe está sempre pronta para ajudar você.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Como funciona
            </h2>
            <p className="text-lg text-gray-600">
              Peça sua comida em 3 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Escolha o Restaurante</h3>
              <p className="text-gray-600">
                Navegue pelos restaurantes disponíveis na sua região e escolha seu favorito.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monte seu Pedido</h3>
              <p className="text-gray-600">
                Adicione seus pratos favoritos ao carrinho e personalize como quiser.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Receba em Casa</h3>
              <p className="text-gray-600">
                Finalize o pagamento e acompanhe a entrega até chegar na sua porta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Cadastre-se agora e ganhe desconto no primeiro pedido!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register/customer">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/restaurants/discover">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-orange-600">
                Ver Restaurantes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Store className="h-8 w-8 text-orange-600" />
                <h4 className="ml-2 text-2xl font-bold">DeliveryNext</h4>
              </div>
              <p className="text-gray-300">
                A melhor plataforma de delivery da sua cidade.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Para Clientes</h5>
              <ul className="space-y-2">
                <li><Link href="/restaurants/discover" className="text-gray-300 hover:text-white">Descobrir Restaurantes</Link></li>
                <li><Link href="/auth/register/customer" className="text-gray-300 hover:text-white">Criar Conta</Link></li>
                <li><Link href="/auth/login" className="text-gray-300 hover:text-white">Fazer Login</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Suporte</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contato</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Empresa</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Sobre Nós</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Trabalhe Conosco</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Imprensa</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-gray-300">
                  © 2024 DeliveryNext. Todos os direitos reservados.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300 mb-2">
                  É dono de um restaurante?
                </p>
                <Link href="/restaurant-owner">
                  <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    <Store className="h-4 w-4 mr-2" />
                    Comece aqui!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}