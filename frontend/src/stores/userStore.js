import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '../services/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)

  const setUser = (userData) => {
    user.value = userData
  }

  const getUser = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await userService.getById(id)
      user.value = response.data
      localStorage.setItem('userId', id)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await userService.create(userData)
      user.value = response.data
      localStorage.setItem('userId', response.data.id)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id, userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await userService.update(id, userData)
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('userId')
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    setUser,
    getUser,
    createUser,
    updateUser,
    logout
  }
})
