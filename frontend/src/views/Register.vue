<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Registrar</h1>
      
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input 
            v-model="form.name" 
            type="text" 
            id="name" 
            required 
            placeholder="Seu nome"
          />
        </div>

        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            id="email" 
            required 
            placeholder="seu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            v-model="form.password" 
            type="password" 
            id="password" 
            required 
            placeholder="Digite uma senha"
          />
        </div>

        <div class="form-group">
          <label for="gross_salary">Salário Bruto:</label>
          <input 
            v-model.number="form.gross_salary" 
            type="number" 
            id="gross_salary" 
            required 
            placeholder="Ex: 5000.00"
            step="0.01"
            min="0"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary" 
          :disabled="loading"
        >
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Já tem conta? <router-link to="/login">Faça login aqui</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  gross_salary: null
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
  loading.value = true
  error.value = null

  try {
    await authStore.register(
      form.value.name,
      form.value.email,
      form.value.password,
      form.value.gross_salary,
      'normal' // Always register as normal user
    )
    // After successful registration, login automatically
    await authStore.login(form.value.email, form.value.password)
    router.push({ name: 'Dashboard' })
  } catch (err) {
    error.value = authStore.error || 'Erro ao registrar'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.auth-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
