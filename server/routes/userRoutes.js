
const express = require('express')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// All user routes require authentication.
router.use(authMiddleware)

// GET USER PROFILE
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Get user profile error:', error)

    res.status(500).json({
      message: 'Failed to fetch user profile'
    })
  }
})

// UPDATE USER SKILLS
router.put('/:id/skills', async (req, res) => {
  try {
    const loggedInUserId = req.user.userId

    if (req.params.id !== loggedInUserId) {
      return res.status(403).json({
        message: 'You can only update your own skills.'
      })
    }

    const { skills } = req.body

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        message: 'Skills must be an array'
      })
    }

    const user = await User.findByIdAndUpdate(
      loggedInUserId,
      { skills },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Skills updated successfully',
      user
    })
  } catch (error) {
    console.error('Update skills error:', error)

    res.status(500).json({
      message: 'Failed to update skills'
    })
  }
})

// UPDATE USER INTEREST
router.put('/:id/interest', async (req, res) => {
  try {
    const loggedInUserId = req.user.userId

    if (req.params.id !== loggedInUserId) {
      return res.status(403).json({
        message: 'You can only update your own interest.'
      })
    }

    const { interest } = req.body

    const allowedInterests = ['build', 'join', 'both']

    if (!allowedInterests.includes(interest)) {
      return res.status(400).json({
        message: 'Invalid interest'
      })
    }

    const user = await User.findByIdAndUpdate(
      loggedInUserId,
      { interest },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      message: 'Interest updated successfully',
      user
    })
  } catch (error) {
    console.error('Update interest error:', error)

    res.status(500).json({
      message: 'Failed to update interest'
    })
  }
})

module.exports = router