<template>
  <div class="profile-container">
    <div class="card">
      <h2>👤 Perfil do Usuário</h2>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else>
        <form @submit.prevent="handleSubmit" class="profile-form">
          <div class="form-group">
            <label for="name">Nome:</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="seu@email.com"
              :disabled="!!user"
            />
          </div>

          <div class="form-group">
            <label for="salary">Salário Bruto Mensal (R$):</label>
            <input
              v-model.number="form.gross_salary"
              type="number"
              id="salary"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div v-if="error" class="error">{{ error }}</div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              Atualizar Perfil
            </button>
          </div>
        </form>

        <div v-if="user" class="user-info mt-3">
          <h3>Informações Cadastradas</h3>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <p><strong>Nome:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Salário Bruto:</strong> R$ {{ formatCurrency(user.gross_salary) }}</p>
          <p><strong>Cadastrado em:</strong> {{ formatDate(user.created_at) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { userService } from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const form = ref({ name: '', email: '', gross_salary: 0 })
const loading = ref(false)
const error = ref(null)
const user = ref(authStore.user)

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name
    form.value.email = authStore.user.email
    form.value.gross_salary = authStore.user.gross_salary
  }
})

const handleSubmit = async () => {
  if (!authStore.user) {
    error.value = 'Usuário não autenticado'
    return
  }

  try {
    error.value = null
    loading.value = true
    const response = await userService.update(authStore.user.id, {
      name: form.value.name,
      gross_salary: form.value.gross_salary
    })
    // Update user in auth store
    authStore.user = response.data
    localStorage.setItem('user', JSON.stringify(response.data))
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao atualizar perfil'
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
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}

.profile-form {
  display: flex;
  flex-direction: column;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.user-info {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
}

.user-info p {
  margin: 0.5rem 0;
  line-height: 1.6;
}
</style>
