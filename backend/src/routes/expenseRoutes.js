import { Router } from 'express'
import ExpenseController from '../controllers/ExpenseController.js'

const router = Router()

router.post('/', ExpenseController.create.bind(ExpenseController))
router.get('/:id', ExpenseController.findById.bind(ExpenseController))
router.get('/', ExpenseController.findByUserAndDate.bind(ExpenseController))
router.put('/:id', ExpenseController.update.bind(ExpenseController))
router.delete('/:id', ExpenseController.delete.bind(ExpenseController))

export default router
