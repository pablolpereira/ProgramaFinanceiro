import UserService from '../services/UserService.js'

class UserController {
  async create(req, res) {
    try {
      // Apenas admin pode criar novos usuários
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem criar usuários' })
      }

      const { name, email, gross_salary } = req.body

      if (!name || !email || !gross_salary) {
        return res.status(400).json({
          error: 'Nome, email e salário bruto são obrigatórios'
        })
      }

      const user = await UserService.create({ name, email, gross_salary })
      return res.status(201).json(user)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.params
      
      // Usuários normais só podem ver o próprio perfil
      if (req.user.role === 'normal' && req.user.userId !== id) {
        return res.status(403).json({ error: 'Acesso negado. Você só pode visualizar o próprio perfil' })
      }

      const user = await UserService.findById(id)
      return res.status(200).json(user)
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }

  async findAll(req, res) {
    try {
      // Apenas admin pode listar todos os usuários
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem listar todos os usuários' })
      }

      const users = await UserService.findAll()
      return res.status(200).json(users)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params
      const { name, gross_salary } = req.body

      // Usuários normais só podem atualizar o próprio perfil
      if (req.user.role === 'normal' && req.user.userId !== id) {
        return res.status(403).json({ error: 'Acesso negado. Você só pode atualizar o próprio perfil' })
      }

      const user = await UserService.update(id, { name, gross_salary })
      return res.status(200).json(user)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params
      
      // Apenas admin pode deletar usuários
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas administradores podem deletar usuários' })
      }

      await UserService.delete(id)
      return res.status(204).send()
    } catch (error) {
      return res.status(404).json({ error: error.message })
    }
  }
}

export default new UserController()
