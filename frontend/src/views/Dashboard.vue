<template>
  <div class="dashboard-container">
    <div class="period-selector">
      <input
        v-model="selectedMonth"
        type="month"
        @change="loadDashboardData"
      />
    </div>

    <div v-if="!loading" class="cards-grid">
      <div class="card card-salary">
        <h3>💵 Salário Bruto</h3>
        <p class="amount">{{ formatCurrency(summary.user?.gross_salary || 0) }}</p>
      </div>

      <div class="card card-total">
        <h3>📊 Total de Despesas</h3>
        <p class="amount">{{ formatCurrency(summary.summary?.total_expenses || 0) }}</p>
      </div>

      <div class="card card-remaining">
        <h3>💰 Restante</h3>
        <p class="amount" :class="getRemainingClass()">
          {{ formatCurrency(summary.comparison?.remaining || 0) }}
        </p>
      </div>

      <div class="card card-percentage">
        <h3>📈 % Comprometido</h3>
        <p class="amount">{{ summary.comparison?.percentage_committed?.toFixed(1) || 0 }}%</p>
      </div>
    </div>

    <div v-if="!loading" class="summary-detail">
      <div class="card">
        <h3>📋 Resumo Detalhado</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span>Cartão de Crédito:</span>
            <span>{{ formatCurrency(summary.summary?.credit_card_total || 0) }}</span>
          </div>
          <div class="summary-item">
            <span>Despesas Mensais:</span>
            <span>{{ formatCurrency(summary.summary?.monthly_total || 0) }}</span>
          </div>
          <div class="summary-item">
            <span>PIX/Débito:</span>
            <span>{{ formatCurrency(summary.summary?.pix_debit_total || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { reportService } from '../services/api'

const authStore = useAuthStore()
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const summary = ref({})
const loading = ref(false)

const getRemainingClass = () => {
  const remaining = summary.value.comparison?.remaining || 0
  return remaining < 0 ? 'negative' : 'positive'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const loadDashboardData = async () => {
  if (!authStore.user) return

  try {
    loading.value = true
    const [year, month] = selectedMonth.value.split('-')
    const response = await reportService.getSummary(
      authStore.user.id,
      parseInt(month),
      parseInt(year)
    )
    summary.value = response.data
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
}

.period-selector {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.period-selector input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card h3 {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card .amount {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.card-salary .amount {
  color: #4caf50;
}

.card-total .amount {
  color: #f44336;
}

.card-remaining .amount {
  transition: color 0.3s;
}

.card-remaining .amount.positive {
  color: #4caf50;
}

.card-remaining .amount.negative {
  color: #f44336;
}

.card-percentage .amount {
  color: #2196f3;
}

.summary-detail {
  margin-top: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item span {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.summary-item span:last-child {
  font-weight: bold;
  color: #667eea;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
