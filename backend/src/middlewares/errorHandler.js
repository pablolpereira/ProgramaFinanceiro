export const errorHandler = (err, req, res, next) => {
  console.error(err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Erro interno do servidor'

  return res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

export const requestLogger = (req, res, next) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime
    console.log(
      `${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`
    )
  })

  next()
}
