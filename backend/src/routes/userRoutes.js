import { Router } from 'express'
import UserController from '../controllers/UserController.js'

const router = Router()

router.post('/', UserController.create.bind(UserController))
router.get('/:id', UserController.findById.bind(UserController))
router.get('/', UserController.findAll.bind(UserController))
router.put('/:id', UserController.update.bind(UserController))
router.delete('/:id', UserController.delete.bind(UserController))

export default router
