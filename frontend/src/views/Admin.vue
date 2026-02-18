<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>Painel de Administração</h1>
      <p>Gerenciamento de usuários do sistema</p>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div class="admin-content">
      <div class="form-section">
        <h2>Cadastrar Novo Usuário</h2>
        
        <form @submit.prevent="handleCreateUser">
          <div class="form-group">
            <label for="name">Nome:</label>
            <input 
              v-model="newUserForm.name" 
              type="text" 
              id="name" 
              required 
              placeholder="Nome do usuário"
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input 
              v-model="newUserForm.email" 
              type="email" 
              id="email" 
              required 
              placeholder="usuario@email.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Senha:</label>
            <input 
              v-model="newUserForm.password" 
              type="password" 
              id="password" 
              required 
              placeholder="Senha do usuário"
            />
          </div>

          <div class="form-group">
            <label for="gross_salary">Salário Bruto:</label>
            <input 
              v-model.number="newUserForm.gross_salary" 
              type="number" 
              id="gross_salary" 
              required 
              placeholder="Ex: 5000.00"
              step="0.01"
              min="0"
            />
          </div>

          <div class="form-group">
            <label for="role">Perfil:</label>
            <select v-model="newUserForm.role" id="role" required>
              <option value="normal">Usuário Normal</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary" 
            :disabled="loadingCreate"
          >
            {{ loadingCreate ? 'Criando...' : 'Criar Usuário' }}
          </button>
        </form>
      </div>

      <div class="list-section">
        <h2>Usuários Cadastrados</h2>
        
        <div v-if="loadingList" class="loading">
          Carregando usuários...
        </div>

        <table v-else-if="users.length > 0" class="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Salário Bruto</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatCurrency(user.gross_salary) }}</td>
              <td>
                <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-normal']">
                  {{ user.role === 'admin' ? 'Administrador' : 'Normal' }}
                </span>
              </td>
              <td>
                <button 
                  @click="deleteUser(user.id)" 
                  class="btn btn-small btn-danger"
                  :disabled="loadingDelete === user.id"
                >
                  {{ loadingDelete === user.id ? '...' : 'Deletar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-else class="no-users">
          Nenhum usuário cadastrado
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService, authService } from '../services/api'

const users = ref([])
const loadingList = ref(false)
const loadingCreate = ref(false)
const loadingDelete = ref(null)
const error = ref(null)

const newUserForm = ref({
  name: '',
  email: '',
  password: '',
  gross_salary: null,
  role: 'normal'
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const loadUsers = async () => {
  loadingList.value = true
  error.value = null
  try {
    const response = await userService.getAll()
    users.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar usuários'
  } finally {
    loadingList.value = false
  }
}

const handleCreateUser = async () => {
  loadingCreate.value = true
  error.value = null

  try {
    await authService.register(
      newUserForm.value.name,
      newUserForm.value.email,
      newUserForm.value.password,
      newUserForm.value.gross_salary,
      newUserForm.value.role
    )

    // Reset form
    newUserForm.value = {
      name: '',
      email: '',
      password: '',
      gross_salary: null,
      role: 'normal'
    }

    // Reload users list
    await loadUsers()
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao criar usuário'
  } finally {
    loadingCreate.value = false
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Tem certeza que deseja deletar este usuário?')) {
    return
  }

  loadingDelete.value = userId
  error.value = null

  try {
    await userService.delete(userId)
    await loadUsers()
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao deletar usuário'
  } finally {
    loadingDelete.value = null
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-header {
  margin-bottom: 2rem;
}

.admin-header h1 {
  color: #333;
  margin: 0 0 0.5rem 0;
}

.admin-header p {
  color: #777;
  margin: 0;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.admin-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .admin-content {
    grid-template-columns: 1fr;
  }
}

.form-section,
.list-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
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

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger {
  background-color: #ff6b6b;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #ff5252;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background-color: #f5f5f5;
}

.users-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  color: #555;
}

.users-table tbody tr:hover {
  background-color: #f9f9f9;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-admin {
  background-color: #e3f2fd;
  color: #1976d2;
}

.badge-normal {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.loading,
.no-users {
  text-align: center;
  padding: 2rem;
  color: #999;
}
</style>
