'use client';

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
  Shield,
  Search
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { NetflixHero } from '@/components/netflix/NetflixHero'
import { NetflixFeatureCard } from '@/components/netflix/NetflixFeatureCard'
import { NetflixCarousel } from '@/components/netflix/NetflixCarousel'
import { NetflixCard } from '@/components/netflix/NetflixCard'

export default function HomePage() {
  const { theme } = useTheme();
  const isNetflix = theme === 'netflix';

  // Sample data for Netflix carousel
  const featuredRestaurants = [
    { id: '1', title: 'Pizzaria Bella', description: 'As melhores pizzas da cidade', rating: 4.8 },
    { id: '2', title: 'Burger House', description: 'Hambúrgueres artesanais', rating: 4.7 },
    { id: '3', title: 'Sushi Master', description: 'Culinária japonesa autêntica', rating: 4.9 },
    { id: '4', title: 'Taco Loco', description: 'Comida mexicana tradicional', rating: 4.6 },
    { id: '5', title: 'Pasta Fresca', description: 'Massas italianas caseiras', rating: 4.8 },
  ];

  return (
    <div className={`min-h-screen ${isNetflix ? 'bg-black' : 'bg-gradient-to-br from-orange-50 to-red-50'}`}>
      {/* Header */}
      <header className={`${isNetflix ? 'bg-black/95 backdrop-blur-sm border-b border-netflix-gray' : 'bg-white'} shadow-sm sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Store className={`h-8 w-8 ${isNetflix ? 'text-netflix-red' : 'text-primary'}`} />
              <h1 className={`ml-2 text-2xl font-bold ${isNetflix ? 'text-white' : 'text-foreground'}`}>DeliveryNext</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="outline" className={isNetflix ? 'border-white/70 text-white hover:bg-white/10' : ''}>Entrar</Button>
              </Link>
              <Link href="/auth/register/customer">
                <Button className={isNetflix ? 'bg-netflix-red hover:bg-netflix-red-dark' : ''}>Cadastrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {isNetflix ? (
        <NetflixHero />
      ) : (
        <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Comida deliciosa na sua porta
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
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
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Criar Conta Grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Featured Restaurants Carousel (Netflix theme only) */}
      {isNetflix && (
        <section className="py-12 bg-black">
          <NetflixCarousel
            title="Restaurantes em Destaque"
            items={featuredRestaurants}
            renderItem={(restaurant) => (
              <NetflixCard
                title={restaurant.title}
                description={restaurant.description}
                rating={restaurant.rating}
                onClick={() => {}}
              />
            )}
          />
        </section>
      )}

      {/* Features Section */}
      <section className={`py-16 ${isNetflix ? 'bg-netflix-gray-dark' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isNetflix ? 'text-white' : 'text-foreground'}`}>
              Por que escolher o DeliveryNext?
            </h2>
            <p className={`text-lg ${isNetflix ? 'text-gray-400' : 'text-muted-foreground'}`}>
              A melhor experiência de delivery da sua cidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isNetflix ? (
              <>
                <NetflixFeatureCard icon={Clock} title="Entrega Rápida" description="Receba seu pedido em até 30 minutos. Acompanhe em tempo real." />
                <NetflixFeatureCard icon={MapPin} title="Cobertura Total" description="Entregamos em toda a cidade. Encontre restaurantes perto de você." />
                <NetflixFeatureCard icon={Star} title="Qualidade Garantida" description="Restaurantes selecionados e avaliados pelos nossos clientes." />
                <NetflixFeatureCard icon={Smartphone} title="Fácil de Usar" description="Interface simples e intuitiva. Faça seu pedido em poucos cliques." />
                <NetflixFeatureCard icon={CreditCard} title="Pagamento Seguro" description="Pague com cartão, PIX ou dinheiro. Seus dados sempre protegidos." />
                <NetflixFeatureCard icon={Shield} title="Suporte 24/7" description="Nossa equipe está sempre pronta para ajudar você." />
              </>
            ) : (
              <>
                <Card className="text-center">
                  <CardHeader>
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Entrega Rápida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Receba seu pedido em até 30 minutos. Acompanhe em tempo real.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Cobertura Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Entregamos em toda a cidade. Encontre restaurantes perto de você.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Qualidade Garantida</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Restaurantes selecionados e avaliados pelos nossos clientes.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Fácil de Usar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Interface simples e intuitiva. Faça seu pedido em poucos cliques.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Pagamento Seguro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Pague com cartão, PIX ou dinheiro. Seus dados sempre protegidos.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Suporte 24/7</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Nossa equipe está sempre pronta para ajudar você.
                    </CardDescription>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={`py-16 ${isNetflix ? 'bg-black' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${isNetflix ? 'text-white' : 'text-foreground'}`}>
              Como funciona
            </h2>
            <p className={`text-lg ${isNetflix ? 'text-gray-400' : 'text-muted-foreground'}`}>
              Peça sua comida em 3 passos simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`${isNetflix ? 'bg-netflix-red' : 'bg-accent'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${isNetflix ? 'text-white' : 'text-accent-foreground'}`}>1</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Escolha o Restaurante</h3>
              <p className={isNetflix ? 'text-gray-400' : 'text-muted-foreground'}>
                Navegue pelos restaurantes disponíveis na sua região e escolha seu favorito.
              </p>
            </div>

            <div className="text-center">
              <div className={`${isNetflix ? 'bg-netflix-red' : 'bg-accent'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${isNetflix ? 'text-white' : 'text-accent-foreground'}`}>2</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Monte seu Pedido</h3>
              <p className={isNetflix ? 'text-gray-400' : 'text-muted-foreground'}>
                Adicione seus pratos favoritos ao carrinho e personalize como quiser.
              </p>
            </div>

            <div className="text-center">
              <div className={`${isNetflix ? 'bg-netflix-red' : 'bg-accent'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}>
                <span className={`text-2xl font-bold ${isNetflix ? 'text-white' : 'text-accent-foreground'}`}>3</span>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Receba em Casa</h3>
              <p className={isNetflix ? 'text-gray-400' : 'text-muted-foreground'}>
                Finalize o pagamento e acompanhe a entrega até chegar na sua porta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 ${isNetflix ? 'bg-netflix-red' : 'bg-primary'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isNetflix ? 'text-white' : 'text-primary-foreground'}`}>
            Pronto para começar?
          </h2>
          <p className={`text-xl mb-8 ${isNetflix ? 'text-white/90' : 'text-primary-foreground/90'}`}>
            Cadastre-se agora e ganhe desconto no primeiro pedido!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register/customer">
              <Button size="lg" variant="secondary" className={`text-lg px-8 py-4 ${isNetflix ? 'bg-white text-netflix-red hover:bg-gray-200' : ''}`}>
                Criar Conta Grátis
              </Button>
            </Link>
            <Link href="/restaurants/discover">
              <Button size="lg" variant="outline" className={`text-lg px-8 py-4 ${isNetflix ? 'border-white text-white hover:bg-white/10' : 'border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary'}`}>
                Ver Restaurantes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${isNetflix ? 'bg-netflix-gray-dark text-white' : 'bg-card text-card-foreground'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Store className={`h-8 w-8 ${isNetflix ? 'text-netflix-red' : 'text-primary'}`} />
                <h4 className={`ml-2 text-2xl font-bold ${isNetflix ? 'text-white' : 'text-foreground'}`}>DeliveryNext</h4>
              </div>
              <p className={isNetflix ? 'text-gray-400' : 'text-muted-foreground'}>
                A melhor plataforma de delivery da sua cidade.
              </p>
            </div>

            <div>
              <h5 className={`font-semibold mb-4 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Para Clientes</h5>
              <ul className="space-y-2">
                <li><Link href="/restaurants/discover" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Descobrir Restaurantes</Link></li>
                <li><Link href="/auth/register/customer" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Criar Conta</Link></li>
                <li><Link href="/auth/login" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Fazer Login</Link></li>
              </ul>
            </div>

            <div>
              <h5 className={`font-semibold mb-4 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Suporte</h5>
              <ul className="space-y-2">
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Central de Ajuda</a></li>
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Contato</a></li>
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h5 className={`font-semibold mb-4 ${isNetflix ? 'text-white' : 'text-foreground'}`}>Empresa</h5>
              <ul className="space-y-2">
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Sobre Nós</a></li>
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Trabalhe Conosco</a></li>
                <li><a href="#" className={`${isNetflix ? 'text-gray-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}>Imprensa</a></li>
              </ul>
            </div>
          </div>

          <div className={`mt-8 pt-8 ${isNetflix ? 'border-t border-netflix-gray' : 'border-t border-border'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <p className={isNetflix ? 'text-gray-400' : 'text-muted-foreground'}>
                  © 2024 DeliveryNext. Todos os direitos reservados.
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className={`mb-2 ${isNetflix ? 'text-gray-400' : 'text-muted-foreground'}`}>
                  É dono de um restaurante?
                </p>
                <Link href="/restaurant-owner">
                  <Button variant="outline" size="sm" className={isNetflix ? 'border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}>
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