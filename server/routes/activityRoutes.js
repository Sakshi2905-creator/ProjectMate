
const express = require('express')

const {
  getRecentActivities,
  getProjectActivities
} = require('../controllers/activityController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// All activity routes require authentication.
router.use(authMiddleware)

// Get activities of the logged-in user.
router.get('/me', getRecentActivities)

// Get activities of a project.
router.get('/project/:projectId', getProjectActivities)

module.exports = router
