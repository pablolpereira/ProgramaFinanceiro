import AuthService from '../services/AuthService.js'

class AuthController {
  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' })
      }

      const result = await AuthService.login(email, password)
      res.json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }

  // Register (admin only)
  static async register(req, res) {
    try {
      const { name, email, password, gross_salary, role } = req.body

      if (!name || !email || !password || gross_salary === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' })
      }

      const user = await AuthService.register(
        name,
        email,
        password,
        gross_salary,
        role || 'normal'
      )

      res.status(201).json({ message: 'Usuário cadastrado com sucesso', user })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  // Get current user info
  static async getCurrentUser(req, res) {
    try {
      const user = req.user
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

export default AuthController
