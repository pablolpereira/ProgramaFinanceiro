# 👨‍💻 DEVELOPMENT.md - Guia do Desenvolvedor

Este documento fornece orientações para desenvolvedores que desejam contribuir ou estender o Finance System.

## 📋 Índice

1. [Setup de Desenvolvimento](#setup-de-desenvolvimento)
2. [Estrutura de Projeto](#estrutura-de-projeto)
3. [Convenções de Código](#convenções-de-código)
4. [Fluxo de Trabalho](#fluxo-de-trabalho)
5. [Debugging](#debugging)
6. [Testes](#testes)
7. [Deployment](#deployment)

## 🛠️ Setup de Desenvolvimento

### Pré-requisitos

```bash
# Node.js 18+
node --version

# PostgreSQL 12+
psql --version

# Git
git --version
```

### Configuração Inicial

```bash
# 1. Clone o repositório
git clone https://seu-repo.git
cd finance-system

# 2. Backend
cd backend
npm install
cp .env.example .env
# Edite .env com dados do PostgreSQL
npm run seed

# 3. Frontend (em outro terminal)
cd frontend
npm install
```

### Scripts Disponíveis

**Backend:**
```bash
npm run dev      # Inicia com nodemon
npm run seed     # Sincroniza BD e faz seed
npm run test     # Roda testes (quando implementados)
npm run lint     # Verifica estilo de código
```

**Frontend:**
```bash
npm run dev      # Inicia dev server com hot reload
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Lint dos arquivos
```

## 📁 Estrutura de Projeto

### Backend

```
backend/
├── src/
│   ├── app.js                    # Configuração Express
│   ├── models/                   # Sequelize models
│   │   ├── User.js
│   │   └── Expense.js
│   ├── controllers/              # Request handlers
│   │   ├── UserController.js
│   │   ├── ExpenseController.js
│   │   └── ReportController.js
│   ├── services/                 # Business logic
│   │   ├── UserService.js
│   │   ├── ExpenseService.js
│   │   └── ReportService.js
│   ├── repositories/             # Data access
│   │   ├── UserRepository.js
│   │   └── ExpenseRepository.js
│   ├── dtos/                     # Data transfer objects
│   │   ├── UserDTO.js
│   │   └── ExpenseDTO.js
│   ├── routes/                   # API routes
│   │   ├── userRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── reportRoutes.js
│   ├── middlewares/              # Custom middleware
│   │   └── errorHandler.js
│   ├── database/                 # DB config
│   │   ├── connection.js
│   │   └── seed.js
│   └── utils/                    # Utilities
│       └── helpers.js
├── .env                          # Config (não commitar)
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── main.js                   # Entry point
│   ├── App.vue                   # Root component
│   ├── views/                    # Page components
│   │   ├── Dashboard.vue
│   │   ├── Expenses.vue
│   │   └── Profile.vue
│   ├── components/               # Reusable components
│   ├── stores/                   # Pinia stores
│   │   ├── userStore.js
│   │   └── expenseStore.js
│   ├── services/                 # HTTP services
│   │   └── api.js
│   ├── router/                   # Vue Router
│   │   └── index.js
│   └── assets/                   # Styles & assets
│       └── main.css
└── package.json
```

## 📝 Convenções de Código

### JavaScript/Node.js

```javascript
// ✅ Use camelCase para variáveis e funções
const userName = 'João';
function calculateTotal() {}

// ✅ Use PascalCase para classes
class UserService {}

// ✅ Use UPPER_SNAKE_CASE para constantes
const MAX_EXPENSES = 100;

// ✅ Arrow functions para callbacks
array.map(item => item.id);

// ✅ Template literals para strings
const message = `Olá, ${name}!`;
```

### Vue.js

```vue
<!-- ✅ PascalCase para componentes -->
<template>
  <NomeComponente />
</template>

<!-- ✅ kebab-case para props -->
<Component :user-name="name" />

<!-- ✅ @event para listeners -->
<button @click="handleClick">Clique</button>

<!-- ✅ v-if/v-for/v-show -->
<div v-if="isVisible">Conteúdo</div>
```

### Nomeação

```javascript
// Services
export const UserService = { ... }

// Controllers
export const UserController = { ... }

// Repositories
export const UserRepository = { ... }

// DTOs
export class UserResponseDTO { ... }

// Stores
export const useUserStore = defineStore('user',...)

// Componentes Vue
// <NomeDoComponente />
```

## 🔄 Fluxo de Trabalho

### Adicionar Nova Funcionalidade

#### 1. Backend

```bash
# 1. Crie o model se necessário
# backend/src/models/NovoModel.js

# 2. Crie o repository
# backend/src/repositories/NovoRepository.js

# 3. Crie o service
# backend/src/services/NovoService.js

# 4. Crie o controller
# backend/src/controllers/NovoController.js

# 5. Crie as routes
# backend/src/routes/novoRoutes.js

# 6. Registre as routes em app.js
app.use('/api/novo', novoRoutes);

# 7. Teste no Postman/REST Client
```

#### 2. Frontend

```bash
# 1. Crie o store se necessário
# frontend/src/stores/novoStore.js

# 2. Crie a view
# frontend/src/views/Novo.vue

# 3. Adicione a rota
// frontend/src/router/index.js
{
  path: '/novo',
  name: 'Novo',
  component: Novo
}

# 4. Crie serviço HTTP se necessário
# frontend/src/services/novoService.js

# 5. Adicione link de navegação em App.vue
```

### Commit Message Convention

```bash
# Formato: tipo(escopo): descrição

# Exemplos
git commit -m "feat(expense): adiciona filtro por data"
git commit -m "fix(user): corrige validação de email"
git commit -m "docs(readme): atualiza instruções de setup"
git commit -m "refactor(service): reorganiza código"
git commit -m "test(repository): adiciona testes unitários"

# Tipos aceitos
feat     # Nova feature
fix      # Correção de bug
docs     # Documentação
style    # Formatação
refactor # Reorganização de código
test     # Testes
```

## 🐛 Debugging

### Backend

```javascript
// Console logging
console.log('Valor:', variavel);
console.error('Erro:', erro);

// Debugger
debugger; // Use node --inspect-brk app.js

// Logs estruturados
const logger = require('./utils/logger'); // Se implementado
logger.info('Mensagem');
```

### Frontend

```javascript
// Vue DevTools (extensão Chrome)
// Inspeciona estado e componentes

// Console
console.log('Estado:', this.user);

// Breakpoints
debugger; // Em qualquer ponto

// Componente de debug
<pre>{{ JSON.stringify(store.$state, null, 2) }}</pre>
```

## ✅ Testes

### Estrutura (quando implementado)

```
backend/
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── repositories/
│   └── integration/
│       └── routes/
```

### Exemplo (com Jest)

```javascript
// tests/unit/services/UserService.test.js
describe('UserService', () => {
  it('deve criar novo usuário', async () => {
    const userData = { name: 'João', email: 'joao@test.com' };
    const result = await UserService.create(userData);
    expect(result.name).toBe('João');
  });
});
```

## 🚀 Deployment

### Build para Produção

**Backend:**
```bash
cd backend
npm install --omit=dev
NODE_ENV=production npm run seed
NODE_ENV=production node src/app.js
```

**Frontend:**
```bash
cd frontend
npm run build
# Arquivos estáticos gerados em dist/
```

### Variáveis de Produção

```env
# backend/.env.production
NODE_ENV=production
PORT=3000
DB_HOST=seu-db-host
DB_USER=seu-user
DB_PASSWORD=sua-senha-segura
```

## 📚 Recursos Úteis

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## ❓ FAQ

### Como adicionar validação a um campo?

**Backend (DTO):**
```javascript
// services/UserService.js
const schema = Joi.object({
  email: Joi.string().email().required()
});
await schema.validateAsync(userData);
```

**Frontend (Vue):**
```vue
<input
  v-model="email"
  type="email"
  required
/>
```

### Como fazer uma query com filtro?

```javascript
// repositories/ExpenseRepository.js
findByUserAndDate(userId, month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return Expense.findAll({
    where: { user_id: userId, expense_date: {
      [Op.between]: [startDate, endDate]
    }}
  });
}
```

### Como chamar API do frontend?

```javascript
// services/api.js ou dentro de store
try {
  const response = await userService.getById(id);
  return response.data;
} catch (error) {
  console.error('Erro:', error);
  throw error;
}
```

---

**Desenvolvido com ❤️ para Finance System**
