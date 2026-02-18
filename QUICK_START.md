# ⚡ Quick Start - 5 Minutos

Guia rápido para colocar o sistema financeiro em funcionamento em 5 minutos.

## ✅ Pré-requisitos

- **Node.js** 18+ instalado
- **PostgreSQL** 12+ rodando localmente
- **npm** ou **yarn**

## 📦 Passo 1: Clonar o Repositório (1 min)

```bash
# Clone ou extraia o projeto
cd finance-system
```

## 🗄️ Passo 2: Preparar Banco de Dados (1 min)

```bash
# Inicie o PostgreSQL (se não estiver rodando)
# No Windows: services.msc ou PostgreSQL do menu iniciar
# No Mac/Linux: brew services start postgresql

# Crie o banco de dados
createdb finance_system -U postgres
```

## 🔙 Passo 3: Setup Backend (1.5 min)

```bash
cd backend

# Instale deps
npm install

# Configure as variáveis de ambiente
# Edite .env com seus dados de acesso do PostgreSQL
# Padrão:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=finance_system
# DB_USER=postgres
# DB_PASSWORD=sua_senha

# Sincronize o banco e execute seed
npm run seed

# Inicie o servidor
npm run dev
```

✅ Backend rodando em `http://localhost:3000`

## 🎨 Passo 4: Setup Frontend (1.5 min)

```bash
# Em outro terminal
cd frontend

# Instale deps
npm install

# Inicie o dev server
npm run dev
```

✅ Frontend rodando em `http://localhost:5173`

## 🎯 Próximos Passos

### 1. Acesse a Aplicação
- Abra no navegador: `http://localhost:5173`

### 2. Crie um Usuário
- Vá para **Perfil**
- Preencha dados de cadastro (nome, email, salário)
- Clique "Cadastrar"

### 3. Adicione Despesas
- Vá para **Despesas**
- Preencha o formulário com:
  - Descrição (ex: "Almoço")
  - Valor
  - Tipo (Cartão, Mensal, PIX/Débito)
  - Categoria (opcional)
  - Data
- Clique "Adicionar Despesa"

### 4. Visualize o Dashboard
- Vá para **Dashboard**
- Veja o resumo financeiro do mês

## 🐛 Troubleshooting

### Erro de Conexão ao Banco
```bash
# Verifique se PostgreSQL está rodando
psql -U postgres

# Se retornar psql>, banco está ok
# Digite: \q para sair
```

### Porta 3000 já está em uso
```bash
# Mude a porta no .env do backend
PORT=3001
npm run dev
```

### Dependências faltando
```bash
# No backend
npm install --force

# No frontend
npm install --force
```

## ✨ Seu Sistema Está Pronto!

Você agora tem um sistema completo e funcional de controle de despesas. Explore as funcionalidades e comece a rastrear seus gastos!

## 📚 Próximas Leituras

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Entenda como funciona internamente
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Guia para desenvolvimento
- [API_EXAMPLES.rest](./API_EXAMPLES.rest) - Testes de API

Divirta-se! 🚀
