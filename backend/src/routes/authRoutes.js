import express from 'express'
import AuthController from '../controllers/AuthController.js'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser)

export default router
