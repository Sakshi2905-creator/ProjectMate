
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required. Please log in.'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded.userId) {
      return res.status(401).json({
        message: 'Invalid authentication token.'
      })
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    })
  }
}

module.exports = authMiddleware
