import ExpenseRepository from '../repositories/ExpenseRepository.js'
import UserRepository from '../repositories/UserRepository.js'
import {
  ExpenseCreateDTO,
  ExpenseUpdateDTO,
  ExpenseResponseDTO
} from '../dtos/ExpenseDTO.js'

class ExpenseService {
  async create(expenseData) {
    const user = await UserRepository.findById(expenseData.user_id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const dto = new ExpenseCreateDTO(expenseData)
    const expense = await ExpenseRepository.create(dto)
    return new ExpenseResponseDTO(expense)
  }

  async findById(id) {
    const expense = await ExpenseRepository.findById(id)
    if (!expense) {
      throw new Error('Despesa não encontrada')
    }
    return new ExpenseResponseDTO(expense)
  }

  async findByUserAndDate(userId, month, year) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const expenses = await ExpenseRepository.findByUserAndDate(userId, month, year)
    return expenses.map((expense) => new ExpenseResponseDTO(expense))
  }

  async findByUserId(userId) {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const expenses = await ExpenseRepository.findByUserId(userId)
    return expenses.map((expense) => new ExpenseResponseDTO(expense))
  }

  async update(id, expenseData) {
    const expense = await ExpenseRepository.findById(id)
    if (!expense) {
      throw new Error('Despesa não encontrada')
    }

    const dto = new ExpenseUpdateDTO(expenseData)
    const updatedExpense = await ExpenseRepository.update(id, dto)
    return new ExpenseResponseDTO(updatedExpense)
  }

  async delete(id) {
    const expense = await ExpenseRepository.findById(id)
    if (!expense) {
      throw new Error('Despesa não encontrada')
    }
    return await ExpenseRepository.delete(id)
  }
}

export default new ExpenseService()
