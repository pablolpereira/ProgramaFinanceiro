import { Router } from 'express'
import ReportController from '../controllers/ReportController.js'

const router = Router()

router.get('/summary', ReportController.generateSummary.bind(ReportController))
router.get('/by-type', ReportController.getExpensesByType.bind(ReportController))
router.get('/monthly-history', ReportController.getMonthlyHistory.bind(ReportController))

export default router
