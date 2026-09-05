const express = require('express')

const {
  getRecentActivities
} = require('../controllers/activityController')

const router = express.Router()

router.get(
  '/:userId',
  getRecentActivities
)

module.exports = router