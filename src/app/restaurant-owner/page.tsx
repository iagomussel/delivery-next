import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Store, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Smartphone, 
  Clock,
  DollarSign,
  Shield,
  Headphones,
  CheckCircle,
  ArrowLeft,
  Star
} from 'lucide-react'

export default function RestaurantOwnerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Voltar</span>
              </Link>
              <Store className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-2xl font-bold text-foreground">DeliveryNext</h1>
              <span className="ml-2 text-sm bg-accent text-accent-foreground px-2 py-1 rounded-full">
                Para Restaurantes
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link href="/auth/register/restaurant">
                <Button className="bg-primary hover:bg-primary/90">Cadastrar Restaurante</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Faça seu restaurante crescer
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Alcance mais clientes, aumente suas vendas e gerencie seu negócio com nossa 
            plataforma completa de delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register/restaurant">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90">
                <Store className="h-5 w-5 mr-2" />
                Cadastrar Meu Restaurante
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Ver Demonstração
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✅ Cadastro gratuito • ✅ Sem taxa de adesão • ✅ Comece a vender hoje
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Por que escolher o DeliveryNext?
            </h2>
            <p className="text-lg text-muted-foreground">
              A plataforma que faz seu restaurante vender mais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Aumente suas Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alcance novos clientes e aumente seu faturamento em até 40%.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Mais Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Conecte-se com milhares de clientes que procuram por comida.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Relatórios Completos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Acompanhe vendas, produtos mais pedidos e performance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Gestão Fácil</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Gerencie pedidos, cardápio e equipe de qualquer lugar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Entrega Rápida</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistema otimizado para entregas rápidas e eficientes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Taxas Justas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comissões competitivas e transparentes. Você ganha mais.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-muted-foreground">
              Ferramentas completas para gerenciar seu restaurante
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Dashboard Completo
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Gestão de Pedidos</h4>
                    <p className="text-muted-foreground">Receba, confirme e acompanhe todos os pedidos em tempo real.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Cardápio Digital</h4>
                    <p className="text-muted-foreground">Crie e edite seu cardápio com fotos, preços e descrições.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Controle de Estoque</h4>
                    <p className="text-muted-foreground">Gerencie disponibilidade de produtos e categorias.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Relatórios de Vendas</h4>
                    <p className="text-muted-foreground">Análises detalhadas para tomar melhores decisões.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-lg p-8">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">Painel de Controle</h4>
                <p className="text-muted-foreground mb-4">
                  Interface intuitiva e fácil de usar
                </p>
                <div className="bg-background rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Vendas Hoje</span>
                    <span className="font-bold text-primary">R$ 1.247,50</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Pedidos</span>
                    <span className="font-bold text-foreground">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avaliação</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-bold text-foreground ml-1">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Como começar
            </h2>
            <p className="text-lg text-muted-foreground">
              Em poucos passos seu restaurante estará online
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Cadastre-se</h3>
              <p className="text-muted-foreground">
                Crie sua conta e cadastre as informações do seu restaurante.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Monte seu Cardápio</h3>
              <p className="text-muted-foreground">
                Adicione seus pratos com fotos, preços e descrições atrativas.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-accent-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Comece a Vender</h3>
              <p className="text-muted-foreground">
                Ative seu restaurante e comece a receber pedidos imediatamente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Suporte especializado
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-6">
                Nossa equipe está pronta para ajudar seu restaurante a crescer.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Headphones className="h-6 w-6 text-primary-foreground/80 mr-3" />
                  <span className="text-primary-foreground/90">Suporte 24/7 por telefone e chat</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-primary-foreground/80 mr-3" />
                  <span className="text-primary-foreground/90">Treinamento gratuito da plataforma</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-primary-foreground/80 mr-3" />
                  <span className="text-primary-foreground/90">Consultoria para aumentar vendas</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Headphones className="h-24 w-24 text-primary-foreground/80 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">
                Fale com nossa equipe
              </h3>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pronto para começar a vender mais?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a centenas de restaurantes que já aumentaram suas vendas conosco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register/restaurant">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90">
                <Store className="h-5 w-5 mr-2" />
                Cadastrar Restaurante Grátis
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-foreground text-foreground hover:bg-foreground hover:text-background">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Sem compromisso • Cancele quando quiser • Suporte gratuito
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card text-card-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Store className="h-8 w-8 text-primary" />
                <h4 className="ml-2 text-2xl font-bold text-foreground">DeliveryNext</h4>
              </div>
              <p className="text-muted-foreground">
                A plataforma que faz seu restaurante crescer.
              </p>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Para Restaurantes</h5>
              <ul className="space-y-2">
                <li><Link href="/auth/register/restaurant" className="text-muted-foreground hover:text-foreground">Cadastrar Restaurante</Link></li>
                <li><Link href="/auth/login" className="text-muted-foreground hover:text-foreground">Área do Parceiro</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Como Funciona</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Suporte</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Central de Ajuda</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contato</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Termos de Parceria</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4 text-foreground">Recursos</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Dicas de Vendas</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Webinars</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-muted-foreground">
                  © 2024 DeliveryNext. Todos os direitos reservados.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-muted-foreground mb-2">
                  Quer pedir comida?
                </p>
                <Link href="/">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Área do Cliente
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
