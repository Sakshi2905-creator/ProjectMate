
const express = require('express')

const {
  getSmartMatches
} = require('../controllers/matchController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Protect all matching routes.
router.use(authMiddleware)

// Get smart matches for the logged-in user.
router.get('/me', getSmartMatches)

module.exports = router
