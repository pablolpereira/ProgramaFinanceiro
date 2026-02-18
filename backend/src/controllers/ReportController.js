import ReportService from '../services/ReportService.js'

class ReportController {
  async generateSummary(req, res) {
    try {
      const { userId, month, year } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' })
      }

      const currentDate = new Date()
      const queryMonth = month || currentDate.getMonth() + 1
      const queryYear = year || currentDate.getFullYear()

      const summary = await ReportService.generateSummary(
        userId,
        parseInt(queryMonth),
        parseInt(queryYear)
      )

      return res.status(200).json(summary)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getExpensesByType(req, res) {
    try {
      const { userId, month, year } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' })
      }

      const currentDate = new Date()
      const queryMonth = month || currentDate.getMonth() + 1
      const queryYear = year || currentDate.getFullYear()

      const data = await ReportService.getExpensesByType(
        userId,
        parseInt(queryMonth),
        parseInt(queryYear)
      )

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  async getMonthlyHistory(req, res) {
    try {
      const { userId, year } = req.query

      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' })
      }

      const currentDate = new Date()
      const queryYear = year || currentDate.getFullYear()

      const history = await ReportService.getMonthlyHistory(
        userId,
        parseInt(queryYear)
      )

      return res.status(200).json(history)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

export default new ReportController()
