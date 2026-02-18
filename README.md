# 💰 Finance System - Sistema de Controle Financeiro Pessoal

Um sistema completo e moderno para controle de despesas pessoais, desenvolvido com Vue.js 3 no frontend, Node.js/Express no backend e PostgreSQL como banco de dados.

## ✨ Características Principais

- 👤 **Gerenciamento de Usuários**: Cadastro e atualização de perfil com salário bruto
- 💸 **Controle de Despesas**: Adicionar, editar e visualizar despesas por tipo
- 📊 **Relatórios Financeiros**: Dashboards com gráficos e análises de gastos
- 📈 **Categorização**: Organizar despesas por categoria (Alimentação, Moradia, etc.)
- 🏷️ **Tipos de Despesa**: Cartão de Crédito, Mensal, PIX/Débito
- 📅 **Filtros Temporais**: Visualizar dados por mês/ano
- 💹 **Análise de Gastos**: Percentual comprometido vs salário bruto

## 🏗️ Arquitetura

### Stack Tecnológico

**Backend**:
- Node.js 18+
- Express 4.18.2
- Sequelize 6.35.2 (ORM)
- PostgreSQL 12+
- Joi (Validação)

**Frontend**:
- Vue 3.3.4
- Vue Router 4.2.5
- Pinia 2.1.6 (State Management)
- Axios 1.6.2 (HTTP Client)
- Vite 5.0.0 (Build Tool)

### Estrutura de Pastas

```
finance-system/
├── backend/
│   ├── src/
│   │   ├── models/          # Models Sequelize
│   │   ├── services/        # Lógica de negócio
│   │   ├── controllers/     # Controladores HTTP
│   │   ├── repositories/    # Camada de dados
│   │   ├── dtos/            # Data Transfer Objects
│   │   ├── routes/          # Definição de rotas
│   │   ├── middlewares/     # Middleware customizado
│   │   ├── database/        # Conexão e seed
│   │   ├── utils/           # Funções utilitárias
│   │   └── app.js           # Entrada principal
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── views/           # Páginas da aplicação
│   │   ├── components/      # Componentes Vue
│   │   ├── stores/          # Stores Pinia
│   │   ├── services/        # Serviços HTTP
│   │   ├── router/          # Configuração de rotas
│   │   ├── assets/          # CSS e assets
│   │   └── main.js          # Entrada principal
│   └── package.json
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 12+

### 1. Configurar Backend

```bash
cd finance-system/backend
npm install

# Configurar variáveis de ambiente
# Editar .env com dados do PostgreSQL

# Sincronizar banco de dados
npm run seed
```

### 2. Iniciar Backend

```bash
npm run dev
# Servidor rodando em http://localhost:3000
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 4. Iniciar Frontend

```bash
npm run dev
# Aplicação rodando em http://localhost:5173
```

## 📚 Documentação Adicional

- [QUICK_START.md](./QUICK_START.md) - Guia rápido de 5 minutos
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detalhes técnicos da arquitetura
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia para desenvolvedores
- [API_EXAMPLES.rest](./API_EXAMPLES.rest) - Exemplos de requisições HTTP

## 🔌 API Endpoints

### Usuários
- `POST /api/users` - Criar novo usuário
- `GET /api/users/:id` - Recuperar usuário
- `GET /api/users` - Listar todos
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

### Despesas
- `POST /api/expenses` - Criar despesa
- `GET /api/expenses/:id` - Recuperar despesa
- `GET /api/expenses?userId=&month=&year=` - Listar com filtros
- `PUT /api/expenses/:id` - Atualizar despesa
- `DELETE /api/expenses/:id` - Deletar despesa

### Relatórios
- `GET /api/reports/summary?userId=&month=&year=` - Resumo financeiro
- `GET /api/reports/by-type?userId=&month=&year=` - Por tipo de despesa
- `GET /api/reports/monthly-history?userId=&year=` - Histórico mensal

## 💾 Modelos de Dados

### User
```
{
  id: UUID (PK),
  name: String,
  email: String (UNIQUE),
  gross_salary: DECIMAL(15,2),
  created_at: TIMESTAMP
}
```

### Expense
```
{
  id: UUID (PK),
  user_id: UUID (FK),
  description: String,
  amount: DECIMAL(15,2),
  expense_type: ENUM('CREDIT_CARD', 'MONTHLY', 'PIX_DEBIT'),
  category: String (nullable),
  expense_date: DATE,
  created_at: TIMESTAMP
}
```

## 🔧 Configuração

### Arquivo .env (Backend)

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_system
DB_USER=postgres
DB_PASSWORD=your_password
```

## 📱 Funcionalidades por Página

### Dashboard
- Visualização do salário bruto
- Total de despesas do período
- Valor restante após gastos
- Percentual de salário comprometido
- Detalhamento por tipo de despesa

### Despesas
- Formulário para adicionar nova despesa
- Lista com todos os gastos
- Filtros por mês/ano e tipo
- Visualização de total gasto
- Data, descrição, categoria e tipo

### Perfil
- Cadastro de novo usuário
- Atualização de nome e salário
- Visualização de dados pessoais
- Função de logout

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido com ❤️

Finance System - Sistema de Controle Financeiro Pessoal | 2024
