import sequelize from './connection.js'
import User from '../models/User.js'
import { Expense } from '../models/Expense.js'
import AuthService from '../services/AuthService.js'

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed do banco de dados...')

    User.hasMany(Expense, { foreignKey: 'user_id' })
    Expense.belongsTo(User, { foreignKey: 'user_id' })

    await sequelize.sync({ alter: true })
    console.log('✓ Banco de dados sincronizado')

    await Expense.destroy({ where: {} })
    await User.destroy({ where: {} })
    console.log('✓ Dados anteriores removidos')

    // Create users with AuthService (hashes password)
    const user1 = await AuthService.register(
      'João Silva',
      'joao@email.com',
      'senha123',
      5000.00,
      'normal'
    )

    const user2 = await AuthService.register(
      'Maria Santos',
      'maria@email.com',
      'senha123',
      6500.00,
      'normal'
    )

    const adminUser = await AuthService.register(
      'Admin User',
      'admin@email.com',
      'admin123',
      10000.00,
      'admin'
    )

    console.log('✓ Usuários criados')

    // Get actual user IDs from database (AuthService returns simplified objects)
    const actualUser1 = await User.findOne({ where: { email: 'joao@email.com' } })
    const actualUser2 = await User.findOne({ where: { email: 'maria@email.com' } })

    const expenses = [
      {
        user_id: actualUser1.id,
        description: 'Almoço no restaurante',
        amount: 75.00,
        expense_type: 'CREDIT_CARD',
        category: 'Alimentação',
        expense_date: new Date('2024-02-10')
      },
      {
        user_id: actualUser1.id,
        description: 'Aluguel do apartamento',
        amount: 1500.00,
        expense_type: 'MONTHLY',
        category: 'Moradia',
        expense_date: new Date('2024-02-01')
      },
      {
        user_id: actualUser1.id,
        description: 'Conta de luz',
        amount: 250.00,
        expense_type: 'MONTHLY',
        category: 'Utilidades',
        expense_date: new Date('2024-02-05')
      },
      {
        user_id: actualUser1.id,
        description: 'Compras no mercado',
        amount: 320.50,
        expense_type: 'PIX_DEBIT',
        category: 'Alimentação',
        expense_date: new Date('2024-02-08')
      },
      {
        user_id: actualUser1.id,
        description: 'Gasolina do carro',
        amount: 180.00,
        expense_type: 'CREDIT_CARD',
        category: 'Transporte',
        expense_date: new Date('2024-02-12')
      },
      {
        user_id: actualUser1.id,
        description: 'Assinatura Netflix',
        amount: 49.90,
        expense_type: 'CREDIT_CARD',
        category: 'Lazer',
        expense_date: new Date('2024-02-15')
      },
      {
        user_id: actualUser1.id,
        description: 'Academia mensal',
        amount: 100.00,
        expense_type: 'PIX_DEBIT',
        category: 'Saúde',
        expense_date: new Date('2024-02-01')
      },
      {
        user_id: actualUser2.id,
        description: 'Aluguel casa',
        amount: 2000.00,
        expense_type: 'MONTHLY',
        category: 'Moradia',
        expense_date: new Date('2024-02-01')
      }
    ]

    await Expense.bulkCreate(expenses)
    console.log('✓ Despesas criadas')

    console.log('\n✅ Seed concluído com sucesso!')
    console.log('\n📊 Dados criados:')
    console.log(`   • 3 usuários (2 normais + 1 admin)`)
    console.log(`   • 8 despesas`)
    console.log('\n🔐 Credenciais de teste:')
    console.log(`   Admin: admin@email.com / admin123`)
    console.log(`   User 1: joao@email.com / senha123`)
    console.log(`   User 2: maria@email.com / senha123`)
  } catch (error) {
    console.error('❌ Erro durante seed:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

seedDatabase()
