import AuthService from '../services/AuthService.js'

// Middleware de autenticação - valida token JWT
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Token não fornecido' })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' })
    }

    const decoded = AuthService.verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido ou expirado' })
    }

    // Adiciona informações do usuário ao request
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Erro na autenticação' })
  }
}

// Middleware de autorização - verifica se é admin
export const authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem executar esta ação' })
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: 'Erro na autorização' })
  }
}

// Middleware de autorização - verifica se é normal ou admin
export const authorizeNormalOrAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    if (req.user.role !== 'normal' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    next()
  } catch (error) {
    return res.status(403).json({ error: 'Erro na autorização' })
  }
}
