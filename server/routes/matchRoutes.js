const express = require('express')

const {
  getSmartMatches
} = require('../controllers/matchController')

const router = express.Router()

router.get(
  '/:userId',
  getSmartMatches
)

module.exports = router