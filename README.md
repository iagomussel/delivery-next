# DeliveryNext - Plataforma Multi-tenant para Delivery

Sistema completo para restaurantes venderem via delivery **sem** processar pagamentos. Coleta endereço, forma de pagamento presencial, dados do pedido e preferências. Suporta opcionais/adicionais com regras por produto.

## 🚀 Funcionalidades

### Para Restaurantes
- **Gestão Multi-tenant**: Cada restaurante tem seu próprio ambiente isolado
- **Cardápio Inteligente**: Produtos com opcionais, adicionais e regras de preço flexíveis
- **Controle de Acesso (RBAC)**: Diferentes níveis: dono, funcionário, afiliado e admin
- **Gestão de Pedidos**: Acompanhamento em tempo real do status dos pedidos
- **Relatórios**: Analytics completos de vendas e performance

### Para Clientes
- **PWA Responsivo**: Interface otimizada para mobile
- **Navegação Intuitiva**: Cardápio organizado por categorias
- **Personalização**: Sistema de opcionais com regras min/max e cotas gratuitas
- **Acompanhamento**: Status do pedido em tempo real

### Para Afiliados
- **Links de Afiliação**: Geração de links UTM/códigos
- **Tracking**: Conversões e comissão estimada
- **Relatórios**: Dashboard dedicado para afiliados

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Deployment**: Netlify

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd delivery-next
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/delivery_next"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-here"
```

4. **Configure o banco de dados**
```bash
# Gerar o cliente Prisma
npm run db:generate

# Executar as migrações
npm run db:migrate
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🗄️ Estrutura do Banco de Dados

### Entidades Principais

- **Tenants**: Empresas/lojas
- **Users**: Usuários do sistema (dono, funcionário, afiliado, admin)
- **Restaurants**: Restaurantes por tenant
- **Products**: Produtos do cardápio
- **OptionGroups**: Grupos de opcionais (ex: "Adicionais", "Tamanho")
- **Options**: Opções dentro dos grupos
- **Orders**: Pedidos dos clientes
- **Customers**: Clientes finais

### Regras de Negócio

- **Opcionais**: Sistema flexível com `min_select`, `max_select`, `free_quota`
- **Preços**: Cálculo automático baseado em `base_price + sum(price_delta)`
- **Multitenancy**: Isolamento completo por `tenant_id`
- **RBAC**: Controle de acesso baseado em roles

## 🚀 Deploy no Netlify

1. **Conecte seu repositório ao Netlify**
2. **Configure as variáveis de ambiente** no painel do Netlify
3. **Configure o banco PostgreSQL** (recomendado: Supabase, PlanetScale, ou Neon)
4. **Execute as migrações** no banco de produção
5. **Deploy automático** será feito a cada push

### Variáveis de Ambiente para Produção

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://your-app.netlify.app"
JWT_SECRET="production-jwt-secret"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"
```

## 📱 PWA (Progressive Web App)

O sistema é otimizado como PWA com:
- **Service Worker**: Cache offline
- **Manifest**: Instalação como app
- **Responsive**: Interface adaptável
- **Push Notifications**: Notificações em tempo real

## 🔐 Autenticação e Segurança

- **JWT Tokens**: Autenticação stateless
- **bcrypt**: Hash de senhas
- **RBAC**: Controle de acesso granular
- **CORS**: Configuração de segurança
- **Rate Limiting**: Proteção contra abuse

## 📊 Monitoramento

- **Logs**: Sistema de auditoria completo
- **Métricas**: Dashboard com KPIs
- **Alertas**: Notificações de eventos importantes
- **Backup**: Estratégia de backup automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato:
- Email: suporte@deliverynext.com
- Discord: [Servidor da Comunidade](https://discord.gg/deliverynext)
- GitHub Issues: [Reportar Bug](https://github.com/deliverynext/issues)

---

**DeliveryNext** - Transformando a forma como restaurantes vendem online! 🍕🚀