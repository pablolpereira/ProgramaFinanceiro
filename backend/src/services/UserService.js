import UserRepository from '../repositories/UserRepository.js'
import { UserCreateDTO, UserUpdateDTO, UserResponseDTO } from '../dtos/UserDTO.js'

class UserService {
  async create(userData) {
    const existingUser = await UserRepository.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email já cadastrado')
    }

    const dto = new UserCreateDTO(userData)
    const user = await UserRepository.create(dto)
    return new UserResponseDTO(user)
  }

  async findById(id) {
    const user = await UserRepository.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return new UserResponseDTO(user)
  }

  async findAll() {
    const users = await UserRepository.findAll()
    return users.map((user) => new UserResponseDTO(user))
  }

  async update(id, userData) {
    const user = await UserRepository.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const dto = new UserUpdateDTO(userData)
    const updatedUser = await UserRepository.update(id, dto)
    return new UserResponseDTO(updatedUser)
  }

  async delete(id) {
    const user = await UserRepository.findById(id)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }
    return await UserRepository.delete(id)
  }
}

export default new UserService()
