<template>
  <div class="expenses-container">
    <div class="card">
      <h2>📝 Cadastro de Despesas</h2>

      <form @submit.prevent="handleAddExpense" class="expense-form">
        <div class="form-row">
          <div class="form-group">
            <label>Descrição:</label>
            <input
              v-model="newExpense.description"
              type="text"
              placeholder="Ex: Almoço"
              required
            />
          </div>
          <div class="form-group">
            <label>Valor (R$):</label>
            <input
              v-model.number="newExpense.amount"
              type="number"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div class="form-group">
            <label>Tipo:</label>
            <select v-model="newExpense.expense_type" required>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="MONTHLY">Mensal</option>
              <option value="PIX_DEBIT">PIX/Débito</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Categoria:</label>
            <input
              v-model="newExpense.category"
              type="text"
              placeholder="Ex: Alimentação"
            />
          </div>
          <div class="form-group">
            <label>Data:</label>
            <input
              v-model="newExpense.expense_date"
              type="date"
              required
            />
          </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Adicionando...' : 'Adicionar Despesa' }}
        </button>
      </form>
    </div>

    <div class="card">
      <h3>Filtros</h3>
      <div class="filter-row">
        <div class="form-group">
          <label>Mês/Ano:</label>
          <input v-model="filterMonth" type="month" @change="loadExpenses" />
        </div>
        <div class="form-group">
          <label>Tipo:</label>
          <select v-model="filterType" @change="loadExpenses">
            <option value="">Todos</option>
            <option value="CREDIT_CARD">Cartão</option>
            <option value="MONTHLY">Mensal</option>
            <option value="PIX_DEBIT">PIX/Débito</option>
          </select>
        </div>
      </div>
    </div>

    <div class="card">
      <h3>📊 Lista de Despesas</h3>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="filteredExpenses.length === 0" class="text-center">
        <p>Nenhuma despesa encontrada</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in filteredExpenses" :key="expense.id">
            <td>{{ formatDate(expense.expense_date) }}</td>
            <td>{{ expense.description }}</td>
            <td>{{ expense.category || '-' }}</td>
            <td>{{ getTypeName(expense.expense_type) }}</td>
            <td class="amount">{{ formatCurrency(expense.amount) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredExpenses.length > 0" class="total-row mt-2">
        <strong>Total:</strong>
        <span class="total-amount">{{ formatCurrency(totalExpenses) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { expenseService } from '../services/api'

const authStore = useAuthStore()

const newExpense = ref({
  description: '',
  amount: 0,
  expense_type: 'PIX_DEBIT',
  category: '',
  expense_date: new Date().toISOString().split('T')[0]
})

const filterMonth = ref(new Date().toISOString().slice(0, 7))
const filterType = ref('')
const loading = ref(false)
const error = ref(null)
const expenses = ref([])

const filteredExpenses = computed(() => {
  return filterType.value
    ? expenses.value.filter(e => e.expense_type === filterType.value)
    : expenses.value
})

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((sum, e) => sum + parseFloat(e.amount), 0)
})

onMounted(() => {
  loadExpenses()
})

const loadExpenses = async () => {
  if (!authStore.user) return
  const [year, month] = filterMonth.value.split('-')
  try {
    loading.value = true
    const response = await expenseService.getByUserAndDate(
      authStore.user.id,
      parseInt(month),
      parseInt(year)
    )
    expenses.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao carregar despesas'
  } finally {
    loading.value = false
  }
}

const handleAddExpense = async () => {
  if (!authStore.user) {
    error.value = 'Você precisa estar autenticado'
    return
  }

  try {
    error.value = null
    loading.value = true
    await expenseService.create({
      ...newExpense.value,
      user_id: authStore.user.id
    })
    newExpense.value = {
      description: '',
      amount: 0,
      expense_type: 'PIX_DEBIT',
      category: '',
      expense_date: new Date().toISOString().split('T')[0]
    }
    await loadExpenses()
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao adicionar despesa'
  } finally {
    loading.value = false
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getTypeName = (type) => {
  const types = {
    CREDIT_CARD: 'Cartão',
    MONTHLY: 'Mensal',
    PIX_DEBIT: 'PIX/Débito'
  }
  return types[type] || type
}
</script>

<style scoped>
.expenses-container {
  max-width: 1200px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.amount {
  font-weight: 600;
  color: #667eea;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  font-size: 1.125rem;
}

.total-amount {
  color: #667eea;
  font-weight: bold;
}

.text-center {
  text-align: center;
  padding: 2rem;
}
</style>
