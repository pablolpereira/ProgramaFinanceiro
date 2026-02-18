import { Expense } from '../models/Expense.js'
import { Op } from 'sequelize'

class ExpenseRepository {
  async create(expenseData) {
    return await Expense.create(expenseData)
  }

  async findById(id) {
    return await Expense.findByPk(id)
  }

  async findByUserAndDate(userId, month, year) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    return await Expense.findAll({
      where: {
        user_id: userId,
        expense_date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      order: [['expense_date', 'DESC']]
    })
  }

  async findByUserId(userId) {
    return await Expense.findAll({
      where: { user_id: userId },
      order: [['expense_date', 'DESC']]
    })
  }

  async update(id, expenseData) {
    const expense = await Expense.findByPk(id)
    if (!expense) {
      return null
    }
    return await expense.update(expenseData)
  }

  async delete(id) {
    const expense = await Expense.findByPk(id)
    if (!expense) {
      return false
    }
    await expense.destroy()
    return true
  }
}

export default new ExpenseRepository()
