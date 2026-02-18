<template>
  <div id="app" class="app-container">
    <nav v-if="authStore.isAuthenticated" class="navbar">
      <div class="nav-content">
        <h1 class="logo">💰 Finance System</h1>
        <ul class="nav-menu">
          <li><router-link to="/">Dashboard</router-link></li>
          <li><router-link to="/expenses">Despesas</router-link></li>
          <li v-if="authStore.isAdmin"><router-link to="/admin">Admin</router-link></li>
          <li><router-link to="/profile">Perfil</router-link></li>
        </ul>
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="user-role" :class="authStore.isAdmin ? 'admin' : 'normal'">
            {{ authStore.isAdmin ? 'Admin' : 'Usuário' }}
          </span>
          <button @click="logout" class="btn-logout">Sair</button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer v-if="authStore.isAuthenticated" class="footer">
      <p>&copy; 2024 Finance Control System. Todos os direitos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  flex: 1;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid transparent;
}

.nav-menu a:hover {
  opacity: 0.8;
}

.nav-menu a.router-link-active {
  border-bottom: 2px solid white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.user-name {
  font-weight: 500;
}

.user-role {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
}

.user-role.admin {
  background-color: rgba(255, 193, 7, 0.3);
  color: #ffe082;
}

.user-role.normal {
  background-color: rgba(76, 175, 80, 0.3);
  color: #a5d6a7;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.main-content {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    gap: 1rem;
  }

  .logo {
    font-size: 1.3rem;
  }

  .main-content {
    padding: 1rem;
  }
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 2rem;
}

.footer p {
  margin: 0;
}
</style>
