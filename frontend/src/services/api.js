import axios from 'axios'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para lidar com erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  register: (name, email, password, gross_salary, role = 'normal') =>
    apiClient.post('/auth/register', { name, email, password, gross_salary, role }),
  getCurrentUser: () => apiClient.get('/auth/me')
}

export const userService = {
  create: (userData) => apiClient.post('/users', userData),
  getById: (id) => apiClient.get(`/users/${id}`),
  getAll: () => apiClient.get('/users'),
  update: (id, userData) => apiClient.put(`/users/${id}`, userData),
  delete: (id) => apiClient.delete(`/users/${id}`)
}

export const expenseService = {
  create: (expenseData) => apiClient.post('/expenses', expenseData),
  getById: (id) => apiClient.get(`/expenses/${id}`),
  getByUserAndDate: (userId, month, year) =>
    apiClient.get('/expenses', { params: { userId, month, year } }),
  update: (id, expenseData) => apiClient.put(`/expenses/${id}`, expenseData),
  delete: (id) => apiClient.delete(`/expenses/${id}`)
}

export const reportService = {
  getSummary: (userId, month, year) =>
    apiClient.get('/reports/summary', { params: { userId, month, year } }),
  getExpensesByType: (userId, month, year) =>
    apiClient.get('/reports/by-type', { params: { userId, month, year } }),
  getMonthlyHistory: (userId, year) =>
    apiClient.get('/reports/monthly-history', { params: { userId, year } })
}

export default apiClient
