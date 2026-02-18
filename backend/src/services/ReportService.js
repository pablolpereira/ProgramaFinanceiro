import ExpenseRepository from '../repositories/ExpenseRepository.js'
import UserRepository from '../repositories/UserRepository.js'
import { EXPENSE_TYPES } from '../models/Expense.js'

class ReportService {
  async generateSummary(userId, month, year) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const expenses = await ExpenseRepository.findByUserAndDate(userId, month, year)

    const creditCardTotal = expenses
      .filter((e) => e.expense_type === EXPENSE_TYPES.CREDIT_CARD)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)

    const monthlyTotal = expenses
      .filter((e) => e.expense_type === EXPENSE_TYPES.MONTHLY)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)

    const pixDebitTotal = expenses
      .filter((e) => e.expense_type === EXPENSE_TYPES.PIX_DEBIT)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)

    const totalExpenses = creditCardTotal + monthlyTotal + pixDebitTotal
    const grossSalary = parseFloat(user.gross_salary)
    const percentageCommitted = grossSalary > 0 ? (totalExpenses / grossSalary) * 100 : 0
    const byCategory = this._groupByCategory(expenses)

    return {
      period: { month, year },
      user: {
        id: user.id,
        name: user.name,
        gross_salary: grossSalary
      },
      summary: {
        credit_card_total: parseFloat(creditCardTotal.toFixed(2)),
        monthly_total: parseFloat(monthlyTotal.toFixed(2)),
        pix_debit_total: parseFloat(pixDebitTotal.toFixed(2)),
        total_expenses: parseFloat(totalExpenses.toFixed(2))
      },
      comparison: {
        gross_salary: grossSalary,
        total_expenses: parseFloat(totalExpenses.toFixed(2)),
        remaining: parseFloat((grossSalary - totalExpenses).toFixed(2)),
        percentage_committed: parseFloat(percentageCommitted.toFixed(2))
      },
      by_category: byCategory,
      expenses_count: expenses.length
    }
  }

  _groupByCategory(expenses) {
    const grouped = {}
    expenses.forEach((expense) => {
      const category = expense.category || 'Sem categoria'
      if (!grouped[category]) {
        grouped[category] = { total: 0, count: 0, items: [] }
      }
      grouped[category].total += parseFloat(expense.amount)
      grouped[category].count += 1
      grouped[category].items.push({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        expense_type: expense.expense_type,
        expense_date: expense.expense_date
      })
    })

    Object.keys(grouped).forEach((category) => {
      grouped[category].total = parseFloat(grouped[category].total.toFixed(2))
    })
    return grouped
  }

  async getExpensesByType(userId, month, year) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const expenses = await ExpenseRepository.findByUserAndDate(userId, month, year)

    return {
      credit_card: expenses
        .filter((e) => e.expense_type === EXPENSE_TYPES.CREDIT_CARD)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0),
      monthly: expenses
        .filter((e) => e.expense_type === EXPENSE_TYPES.MONTHLY)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0),
      pix_debit: expenses
        .filter((e) => e.expense_type === EXPENSE_TYPES.PIX_DEBIT)
        .reduce((sum, e) => sum + parseFloat(e.amount), 0)
    }
  }

  async getMonthlyHistory(userId, year) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const history = []
    for (let month = 1; month <= 12; month++) {
      const expenses = await ExpenseRepository.findByUserAndDate(userId, month, year)
      const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0)
      history.push({
        month,
        total: parseFloat(totalExpenses.toFixed(2)),
        count: expenses.length
      })
    }
    return history
  }
}

export default new ReportService()
