import User from '../models/User.js'

class UserRepository {
  async create(userData) {
    return await User.create(userData)
  }

  async findById(id) {
    return await User.findByPk(id)
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } })
  }

  async findAll() {
    return await User.findAll()
  }

  async update(id, userData) {
    const user = await User.findByPk(id)
    if (!user) {
      return null
    }
    return await user.update(userData)
  }

  async delete(id) {
    const user = await User.findByPk(id)
    if (!user) {
      return false
    }
    await user.destroy()
    return true
  }
}

export default new UserRepository()
