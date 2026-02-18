import { defineStore } from 'pinia'
import { ref } from 'vue'
import { expenseService } from '../services/api'

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchExpenses = async (userId, month, year) => {
    loading.value = true
    error.value = null
    try {
      const response = await expenseService.getByUserAndDate(userId, month, year)
      expenses.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createExpense = async (expenseData) => {
    loading.value = true
    error.value = null
    try {
      const response = await expenseService.create(expenseData)
      expenses.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateExpense = async (id, expenseData) => {
    loading.value = true
    error.value = null
    try {
      const response = await expenseService.update(id, expenseData)
      const index = expenses.value.findIndex(e => e.id === id)
      if (index !== -1) {
        expenses.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteExpense = async (id) => {
    loading.value = true
    error.value = null
    try {
      await expenseService.delete(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearExpenses = () => {
    expenses.value = []
  }

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    clearExpenses
  }
})
