# 🗺️ Roadmap de Páginas - Smart Market

Este documento mapeia todas as páginas e rotas disponíveis no projeto **mercado-frontend-web**.

---

## 📋 Índice

1. [Páginas Públicas](#páginas-públicas)
2. [Páginas de Autenticação](#páginas-de-autenticação)
3. [Páginas de Mercados](#páginas-de-mercados)
4. [Páginas de Produtos](#páginas-de-produtos)
5. [Páginas do Usuário (Área Logada)](#páginas-do-usuário-área-logada)
6. [Páginas de Suporte](#páginas-de-suporte)
7. [Páginas de Download](#páginas-de-download)

---

## 🌐 Páginas Públicas

### 1. **Homepage** (`/`)
- **Rota**: `/`
- **Arquivo**: `src/app/(app)/page.tsx`
- **Descrição**: Página inicial com seções de produtos (Promoções, Destaques, Novidades), barra de busca com IA e hero section
- **Funcionalidades**:
  - Exibição de produtos em carrossel
  - Busca de produtos
  - Navegação para mercados e produtos

---

## 🔐 Páginas de Autenticação

### 2. **Registro de Mercado** (`/auth/register-market`)
- **Rota**: `/auth/register-market`
- **Arquivo**: `src/app/auth/register-market/page.tsx`
- **Descrição**: Formulário para cadastro de novos mercados
- **Funcionalidades**:
  - Cadastro de mercado com nome, endereço, logo
  - Criação de conta de usuário (Auth0)
  - Validação de senha forte
  - Redirecionamento para login após cadastro

### 3. **Login** (Auth0)
- **Rota**: `/auth/login`
- **Descrição**: Página de login gerenciada pelo Auth0
- **Nota**: Rota gerenciada pelo middleware do Auth0

---

## 🏪 Páginas de Mercados

### 4. **Lista de Mercados** (`/market`)
- **Rota**: `/market`
- **Arquivo**: `src/app/(app)/market/page.tsx`
- **Descrição**: Listagem de todos os mercados disponíveis
- **Funcionalidades**:
  - Grid de mercados com cards
  - Filtros de mercado
  - Paginação
  - Informações: nome, endereço, avaliação, taxa de entrega
  - Link para página individual do mercado

### 5. **Página do Mercado** (`/market/[marketId]`)
- **Rota**: `/market/[marketId]`
- **Arquivo**: `src/app/(app)/market/[marketId]/page.tsx`
- **Descrição**: Página detalhada de um mercado específico
- **Funcionalidades**:
  - Banner e informações do mercado
  - Lista de produtos do mercado
  - Filtros de produtos
  - Busca de produtos
  - Botão de chat com o mercado
  - Ações do mercado (compartilhar, favoritar, etc.)
  - Seção de promoções
  - Paginação de produtos

---

## 🛍️ Páginas de Produtos

### 6. **Página do Produto** (`/market/[marketId]/product/[product_id]`)
- **Rota**: `/market/[marketId]/product/[product_id]`
- **Arquivo**: `src/app/(app)/market/[marketId]/product/[product_id]/page.tsx`
- **Descrição**: Página detalhada de um produto específico
- **Funcionalidades**:
  - Imagens do produto
  - Informações detalhadas (nome, preço, SKU, unidade, categoria)
  - Descontos e promoções
  - Informações de pagamento e parcelamento
  - Informações de frete
  - Informações do mercado vendedor
  - Controles de quantidade e adicionar ao carrinho
  - Descrição do produto
  - Garantias e devoluções

---

## 👤 Páginas do Usuário (Área Logada)

> **Nota**: Todas as páginas abaixo requerem autenticação. O layout `my/layout.tsx` redireciona para `/auth/login` se o usuário não estiver autenticado.

### 7. **Carrinho de Compras** (`/my/cart`)
- **Rota**: `/my/cart`
- **Arquivo**: `src/app/(app)/my/cart/page.tsx`
- **Descrição**: Visualização e gerenciamento do carrinho de compras
- **Funcionalidades**:
  - Lista de produtos no carrinho agrupados por mercado
  - Seleção de endereço de entrega
  - Seleção de método de pagamento
  - Cálculo de totais
  - Navegação para checkout

### 8. **Checkout** (`/my/checkout`)
- **Rota**: `/my/checkout?marketId={marketId}`
- **Arquivo**: `src/app/(app)/my/checkout/page.tsx`
- **Descrição**: Finalização do pedido
- **Funcionalidades**:
  - Seleção de endereço de entrega
  - Formulário de entrega
  - Resumo do pedido
  - Seleção de método de pagamento
  - Confirmação e criação do pedido

### 9. **Meus Pedidos** (`/my/orders`)
- **Rota**: `/my/orders`
- **Arquivo**: `src/app/(app)/my/orders/page.tsx`
- **Descrição**: Lista de todos os pedidos do usuário
- **Funcionalidades**:
  - Lista de pedidos com status
  - Filtros por status
  - Informações do mercado de cada pedido
  - Link para detalhes do pedido

### 10. **Detalhes do Pedido** (`/my/orders/[id]`)
- **Rota**: `/my/orders/[id]`
- **Arquivo**: `src/app/(app)/my/orders/[id]/page.tsx`
- **Descrição**: Detalhes completos de um pedido específico
- **Funcionalidades**:
  - Timeline de status do pedido
  - Lista de produtos do pedido
  - Informações de entrega
  - Resumo financeiro (total, desconto, subtotal)
  - Informações do entregador (se disponível)

### 11. **Histórico de Sugestões** (`/my/history`)
- **Rota**: `/my/history?page={page}&size={size}`
- **Arquivo**: `src/app/(app)/my/history/page.tsx`
- **Descrição**: Histórico de sugestões de produtos criadas pelo usuário
- **Funcionalidades**:
  - Timeline de sugestões
  - Filtros e paginação
  - Preview de produtos essenciais e utensílios
  - Link para visualizar sugestão completa

### 12. **Sugestão de Produtos** (`/my/suggestion/[suggestion_id]`)
- **Rota**: `/my/suggestion/[suggestion_id]?marketId={marketId}`
- **Arquivo**: `src/app/(app)/my/suggestion/[suggestion_id]/page.tsx`
- **Descrição**: Visualização detalhada de uma sugestão de produtos
- **Funcionalidades**:
  - Menu lateral com categorias e produtos
  - Comparação de preços entre mercados
  - Seleção de mercado para visualizar produtos
  - Produtos agrupados por categoria
  - Modo de preparo (quando aplicável)
  - Adicionar produtos ao carrinho

### 13. **Chat com Mercado** (`/my/chat/[chatId]`)
- **Rota**: `/my/chat/[chatId]`
- **Arquivo**: `src/app/(app)/my/chat/[chatId]/page.tsx`
- **Descrição**: Sistema de chat entre cliente e mercado
- **Funcionalidades**:
  - Lista de conversas na lateral
  - Interface de chat em tempo real
  - Preview de última mensagem
  - Indicador de conversa ativa
  - Suporte para múltiplas conversas

### 14. **Perfil do Usuário** (`/my/profile`)
- **Rota**: `/my/profile`
- **Arquivo**: `src/app/(app)/my/profile/page.tsx`
- **Descrição**: Gerenciamento de perfil e configurações
- **Funcionalidades**:
  - Menu lateral de navegação
  - Informações pessoais
  - Gerenciamento de endereços
  - Seção de logout

---

## 📱 Páginas de Download

### 15. **Download Mobile** (`/mobile-download`)
- **Rota**: `/mobile-download`
- **Arquivo**: `src/app/mobile-download/page.tsx`
- **Descrição**: Página de redirecionamento para download do app mobile
- **Funcionalidades**:
  - Links para App Store e Google Play
  - Redirecionamento automático para dispositivos móveis (via middleware)

---

## 🔄 Rotas Especiais e Comportamentos

### Middleware
- **Arquivo**: `src/middleware.ts`
- **Funcionalidades**:
  - Redirecionamento automático de dispositivos móveis para `/mobile-download`
  - Autenticação via Auth0
  - Proteção de rotas

### Layouts
- **Layout Principal** (`src/app/layout.tsx`): Layout raiz com providers (Theme, Google Maps, Toaster)
- **Layout da App** (`src/app/(app)/layout.tsx`): Layout com Header e HistorySideMenu
- **Layout My** (`src/app/(app)/my/layout.tsx`): Layout protegido que requer autenticação

---

## 📊 Resumo de Rotas

| Categoria | Quantidade | Rotas |
|-----------|------------|-------|
| Públicas | 1 | `/` |
| Autenticação | 2 | `/auth/register-market`, `/auth/login` |
| Mercados | 2 | `/market`, `/market/[marketId]` |
| Produtos | 1 | `/market/[marketId]/product/[product_id]` |
| Usuário (Logado) | 8 | `/my/cart`, `/my/checkout`, `/my/orders`, `/my/orders/[id]`, `/my/history`, `/my/suggestion/[suggestion_id]`, `/my/chat/[chatId]`, `/my/profile` |
| Download | 1 | `/mobile-download` |
| **TOTAL** | **15** | |

---

## 🎯 Funcionalidades Principais por Área

### 🛒 E-commerce
- Busca de produtos com IA
- Navegação por mercados
- Carrinho de compras
- Checkout completo
- Gestão de pedidos

### 💬 Comunicação
- Chat em tempo real com mercados
- Histórico de conversas

### 🤖 IA e Sugestões
- Busca inteligente de produtos
- Sugestões personalizadas de produtos
- Comparação de preços entre mercados

### 👤 Gestão de Conta
- Perfil do usuário
- Gerenciamento de endereços
- Histórico de pedidos e sugestões

---

## 📝 Notas Técnicas

1. **Autenticação**: Utiliza Auth0 para gerenciamento de sessões
2. **Rotas Dinâmicas**: Next.js App Router com rotas dinâmicas `[param]`
3. **Proteção de Rotas**: Middleware e layouts protegem rotas autenticadas
4. **Server Components**: Maioria das páginas são Server Components do Next.js 15
5. **Responsividade**: Layouts adaptáveis para mobile e desktop
6. **SEO**: Metadata configurado em várias páginas principais

---

## 🚀 Melhorias Futuras Sugeridas

- [ ] Página de busca avançada
- [ ] Página de favoritos/produtos salvos
- [ ] Página de avaliações e reviews
- [ ] Página de cupons e descontos
- [ ] Dashboard do mercado (para lojistas)
- [ ] Página de ajuda/suporte
- [ ] Página de termos e privacidade
- [ ] Página de sobre

---

**Última atualização**: Baseado na estrutura atual do projeto mercado-frontend-web

