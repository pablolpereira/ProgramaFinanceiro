import ExpenseService from '../services/ExpenseService.js'
import { EXPENSE_TYPES } from '../models/Expense.js'

class ExpenseController {
  async create(req, res) {
    try {
      const { user_id, description, amount, expense_type, category, expense_date } = req.body

      // Usuários normais só podem criar despesas para o próprio usuário
      if (req.user.role === 'normal' && req.user.userId !== user_id) {
        return res.status(403).json({ error: 'Você só pode criar despesas para sua própria conta' })
      }

      if (!user_id || !description || !amount) {
        return res.status(400).json({
          error: 'Usuário, descrição e valor são obrigatórios'
        })
      }

      if (!Object.values(EXPENSE_TYPES).includes(expense_type)) {
        return res.status(400).json({
          error: `Tipo de despesa inválido. Aceitos: ${Object.values(EXPENSE_TYPES).join(', ')}`
        })
      }

      const expense = await ExpenseService.create({
        user_id,
        description,
        amount,
        expense_type,
        category,
        expense_date: expense_date || new Date()
      })

      return res.status(201).json(expense)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params
      const expense = await ExpenseService.findById(id)

      // Usuários normais só podem ver suas próprias despesas
      if (req.user.role === 'normal' && req.user.userId !== expense.user_id) {
        return res.status(403).json({ error: 'Você só pode ver suas próprias despesas' })
      }

      return res.status(200).json(expense)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async findByUserAndDate(req, res) {
    try {
      const { userId, month, year } = req.query

      // Usuários normais só podem ver suas próprias despesas
      if (req.user.role === 'normal' && req.user.userId !== userId) {
        return res.status(403).json({ error: 'Você só pode ver suas próprias despesas' })
      }

      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' })
      }

      const currentDate = new Date()
      const queryMonth = month || currentDate.getMonth() + 1
      const queryYear = year || currentDate.getFullYear()

      const expenses = await ExpenseService.findByUserAndDate(
        userId,
        parseInt(queryMonth),
        parseInt(queryYear)
      )

      return res.status(200).json(expenses)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { description, amount, expense_type, category, expense_date } = req.body

      // Verificar se a despesa pertence ao usuário
      const expense = await ExpenseService.findById(id)
      if (req.user.role === 'normal' && req.user.userId !== expense.user_id) {
        return res.status(403).json({ error: 'Você só pode editar suas próprias despesas' })
      }

      if (
        expense_type &&
        !Object.values(EXPENSE_TYPES).includes(expense_type)
      ) {
        return res.status(400).json({
          error: `Tipo de despesa inválido. Aceitos: ${Object.values(EXPENSE_TYPES).join(', ')}`
        })
      }

      const updatedExpense = await ExpenseService.update(id, {
        description,
        amount,
        expense_type,
        category,
        expense_date
      })

      return res.status(200).json(updatedExpense)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params

      // Verificar se a despesa pertence ao usuário
      const expense = await ExpenseService.findById(id)
      if (req.user.role === 'normal' && req.user.userId !== expense.user_id) {
        return res.status(403).json({ error: 'Você só pode deletar suas próprias despesas' })
      }

      await ExpenseService.delete(id)
      return res.status(204).send()
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }
}

export default new ExpenseController()
