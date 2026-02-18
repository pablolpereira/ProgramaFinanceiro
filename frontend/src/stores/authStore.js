import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Load user and token from localStorage on initialization
  const initializeAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isNormal = computed(() => user.value?.role === 'normal')

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      token.value = response.data.token
      user.value = response.data.user

      // Save to localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (name, email, password, gross_salary, role = 'normal') => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(name, email, password, gross_salary, role)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao registrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const getCurrentUser = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.getCurrentUser()
      user.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Erro ao obter usuário'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isNormal,
    initializeAuth,
    login,
    register,
    logout,
    getCurrentUser
  }
})
