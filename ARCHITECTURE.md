# 🏗️ Arquitetura - Detalhes Técnicos

Documento detalhado sobre a arquetitura, padrões de design e decisões técnicas do Finance System.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Camadas da Aplicação](#camadas-da-aplicação)
3. [Padrões de Design](#padrões-de-design)
4. [Stack Tecnológico](#stack-tecnológico)
5. [Fluxo de Dados](#fluxo-de-dados)
6. [Banco de Dados](#banco-de-dados)

## 👁️ Visão Geral

O Finance System segue uma arquitetura **full-stack moderna** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vue 3)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Views (Dashboard, Expenses, Profile)                │   │
│  │ ├─ Router                                             │   │
│  │ └─ Pinia Stores (User, Expense)                      │   │
│  │    └─ API Service (Axios)                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────┬──────────────────────────────────┘
                         HTTP/REST
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes (API Endpoints)                              │   │
│  │ ├─ Controllers (Request Handling)                   │   │
│  │ ├─ Services (Business Logic)                        │   │
│  │ ├─ Repositories (Data Access)                       │   │
│  │ └─ Models (Sequelize)                               │   │
│  │    └─ Database (PostgreSQL)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ Camadas da Aplicação

### Frontend

#### 1. **Presentation Layer (Views)**
- `Dashboard.vue` - Visualização principal com resumo financeiro
- `Expenses.vue` - Gerenciamento e listagem de despesas
- `Profile.vue` - Cadastro e atualização de perfil

**Responsabilidades:**
- Renderizar UI
- Capturar eventos do usuário
- Validação básica de formulário
- Mostrar feedback visual

#### 2. **Routing Layer**
- `router/index.js` - Configuração de rotas Vue Router
- Mapeia URLs para componentes
- Implementa navegação entre páginas

#### 3. **State Management (Stores)**
- `stores/userStore.js` (Pinia) - Estado de usuário
- `stores/expenseStore.js` (Pinia) - Estado de despesas
- Gerencia estado global reativo
- Cache de dados do servidor

#### 4. **Service Layer**
- `services/api.js` - Cliente HTTP Axios
- Interface com backend API
- Faz requisições e recebe dados

### Backend

#### 1. **Routing Layer**
- `routes/userRoutes.js` - Rotas de usuário
- `routes/expenseRoutes.js` - Rotas de despesas
- `routes/reportRoutes.js` - Rotas de relatórios
- Define endpoints HTTP (GET, POST, PUT, DELETE)

#### 2. **Controller Layer**
- `controllers/UserController.js` - Handler de requisições de usuário
- `controllers/ExpenseController.js` - Handler de requisições de despesa
- `controllers/ReportController.js` - Handler de requisições de relatório

**Responsabilidades:**
- Extrair queries/body da requisição
- Chamar service correspondente
- Retornar resposta HTTP

#### 3. **Service Layer**
- `services/UserService.js` - Lógica de negócio de usuário
- `services/ExpenseService.js` - Lógica de negócio de despesa
- `services/ReportService.js` - Lógica de cálculos e relatórios

**Responsabilidades:**
- Validar dados (regras de negócio)
- Chamar repository para persistência
- Transformação de DTOs
- Cálculos e processamento

#### 4. **Repository/Data Access Layer**
- `repositories/UserRepository.js` - Acesso aos dados de usuário
- `repositories/ExpenseRepository.js` - Acesso aos dados de despesa

**Responsabilidades:**
- Operações CRUD no banco
- Query builders
- Abstração do ORM

#### 5. **Model Layer**
- `models/User.js` - Definição do modelo Sequelize de usuário
- `models/Expense.js` - Definição do modelo Sequelize de despesa
- Esquema de tabelas
- Validações em nível de modelo
- Relacionamentos

## 🎨 Padrões de Design

### 1. **MVC Pattern**
- **Model**: Sequelize models definem estrutura
- **View**: Vue components renderizam UI
- **Controller**: Controllers processam requisições

### 2. **Repository Pattern**
```javascript
// Abstrai acesso a dados
const user = await UserRepository.findById(id);
```
- Desacopla business logic de persistência
- Facilita testes unitários

### 3. **Service Layer Pattern**
```javascript
// Concentra regras de negócio
await UserService.create(userData);
```
- Lógica reutilizável
- Separação de responsabilidades

### 4. **DTO Pattern**
```javascript
// Transferência segura de dados
const userDTO = new UserResponseDTO(user);
```
- Validação de entrada
- Transformação de saída
- Protege dados internos

### 5. **Store Pattern (Pinia)**
```javascript
// State management centralizado
const user = userStore.user;
```
- Source of truth único
- Reatividade automática

### 6. **API Service Pattern**
```javascript
// Centraliza chamadas HTTP
const response = await userService.getById(id);
```
- Interceptors e configuração central
- Reutilização de client

## 🛠️ Stack Tecnológico

### Backend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18.2 | Framework web |
| Sequelize | 6.35.2 | ORM |
| PostgreSQL | 12+ | Banco relacional |
| Joi | Latest | Validação de schema |
| Dotenv | Latest | Config de env |

### Frontend

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Vue | 3.3.4 | Framework UI |
| Vue Router | 4.2.5 | Roteamento |
| Pinia | 2.1.6 | State management |
| Axios | 1.6.2 | HTTP client |
| Vite | 5.0.0 | Build tool |

## 🔄 Fluxo de Dados

### Exemplo: Criar Nova Despesa

```
1. Usuário preenche formulário e clica "Adicionar"
   ↓
2. Expenses.vue chama expenseStore.createExpense()
   ↓
3. expenseStore chama expenseService.create() via api.js
   ↓
4. API POST /api/expenses com dados
   ↓
5. Backend recebe em ExpenseController.create()
   ↓
6. Controller extrai dados e chama ExpenseService.create()
   ↓
7. Service valida e chama ExpenseRepository.create()
   ↓
8. Repository executa Expense.create() no Sequelize
   ↓
9. Sequelize insere no PostgreSQL
   ↓
10. Resposta volta transformada em ExpenseDTO
   ↓
11. Frontend recebe e atualiza store
   ↓
12. Vue re-renderiza componente com novo dado
```

## 💾 Banco de Dados

### Schema

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  gross_salary DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Despesas
CREATE TABLE expenses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  expense_type ENUM('CREDIT_CARD', 'MONTHLY', 'PIX_DEBIT'),
  category VARCHAR(255),
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relacionamentos

```
User (1) ──┬──── (N) Expense
           │
           └─ Relacionamento One-to-Many
```

- Um usuário pode ter muitas despesas
- Uma despesa pertence a um usuário
- Integridade referencial via foreign key

## 🔐 Validações

### Backend
- **DTO Validation**: Joi schemas validam toda entrada
- **Model Validation**: Sequelize validadores
- **Business Logic**: Service layer valida regras

### Frontend
- **Form Validation**: HTML5 + regras customizadas
- **Type Checking**: Vue 3 Composition API com TypeScript-ready
- **Store Validation**: Pinia com estado tipado

## 📊 Relatórios

### Tipos de Relatório

1. **Summary**: 
   - Total geral por período
   - Percentual comprometido
   - Breakdown por tipo

2. **By Type**:
   - Cartão de Crédito total
   - Mensal total
   - PIX/Débito total

3. **Monthly History**:
   - Dados de 12 meses
   - Tendências e comparações

## 🚀 Performance

### Otimizações

- **Frontend**:
  - Code splitting com Vue Router
  - Lazy loading de componentes
  - Caching de dados em Pinia

- **Backend**:
  - Pool de conexões Sequelize
  - Índices no banco de dados
  - DTOs previnem over-fetching

## 📈 Escalabilidade

Arquitetura preparada para crescimento:
- Separação de responsabilidades facilita manutenção
- DTOs permitem versionamento de API
- Repository pattern permite trocar storage
- Service layer concentra lógica reutilizável

---

**Documentado com ❤️ para Finance System**
