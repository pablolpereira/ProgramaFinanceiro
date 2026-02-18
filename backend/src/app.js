import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import sequelize from './database/connection.js'
import User from './models/User.js'
import { Expense } from './models/Expense.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import reportRoutes from './routes/reportRoutes.js'

import { errorHandler, requestLogger } from './middlewares/errorHandler.js'
import { authenticate } from './middlewares/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const initializeDatabase = async () => {
  try {
    User.hasMany(Expense, { foreignKey: 'user_id' })
    Expense.belongsTo(User, { foreignKey: 'user_id' })
    await sequelize.sync({ alter: true })
    console.log('✓ Database synchronized')
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error)
    process.exit(1)
  }
}

// Public routes
app.use('/api/auth', authRoutes)

// Protected routes
app.use('/api/users', authenticate, userRoutes)
app.use('/api/expenses', authenticate, expenseRoutes)
app.use('/api/reports', authenticate, reportRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use(errorHandler)

const startServer = async () => {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   Finance Control System - Backend         ║
║   Server running on port ${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}         ║
╚════════════════════════════════════════════╝
      `)
    })
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error)
    process.exit(1)
  }
}

startServer()
export default app
