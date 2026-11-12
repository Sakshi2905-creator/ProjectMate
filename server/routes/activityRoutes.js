const express = require('express')

const {
  getRecentActivities,
  getProjectActivities
} = require('../controllers/activityController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// Existing personal activity route
router.get(
  '/:userId',
  getRecentActivities
)

// New project activity route
router.get(
  '/project/:projectId',
  authMiddleware,
  getProjectActivities
)

module.exports = router