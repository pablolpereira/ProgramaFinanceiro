import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRE = '24h'

class AuthService {
  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10)
  }

  // Compare passwords
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword)
  }

  // Generate JWT token
  static generateToken(userId, email, role) {
    return jwt.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE })
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  // Register new user (admin only)
  static async register(name, email, password, gross_salary, role = 'normal') {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        throw new Error('Email já cadastrado')
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password)

      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        gross_salary,
        role
      })

      // Return user without password
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        gross_salary: user.gross_salary,
        role: user.role,
        created_at: user.created_at
      }
    } catch (error) {
      throw error
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } })
      if (!user) {
        throw new Error('Email ou senha inválido')
      }

      // Compare passwords
      const isValidPassword = await this.comparePassword(password, user.password)
      if (!isValidPassword) {
        throw new Error('Email ou senha inválido')
      }

      // Generate token
      const token = this.generateToken(user.id, user.email, user.role)

      // Return user data with token
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          gross_salary: user.gross_salary,
          role: user.role,
          created_at: user.created_at
        }
      }
    } catch (error) {
      throw error
    }
  }
}

export default AuthService
