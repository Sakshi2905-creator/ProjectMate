const express = require('express')
const User = require('../models/User')

const router = express.Router()

// GET USER PROFILE

router.get('/:id', async (req, res) => {

  try {

    const user = await User.findById(req.params.id)
      .select('-password')

    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      })

    }

    res.status(200).json({
      user
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch user profile'
    })

  }

})
// UPDATE USER SKILLS

router.put('/:id/skills', async (req, res) => {

  try {

    const { skills } = req.body

    if (!Array.isArray(skills)) {

      return res.status(400).json({
        message: 'Skills must be an array'
      })

    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        skills: skills
      },
      {
        new: true
      }
    )

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

    console.error(error)

    res.status(500).json({
      message: 'Failed to update skills'
    })

  }

})
// UPDATE USER INTEREST

router.put('/:id/interest', async (req, res) => {

  try {

    const { interest } = req.body

    const allowedInterests = [
      'build',
      'join',
      'both'
    ]

    if (!allowedInterests.includes(interest)) {

      return res.status(400).json({
        message: 'Invalid interest'
      })

    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        interest: interest
      },
      {
        new: true
      }
    )

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

    console.error(error)

    res.status(500).json({
      message: 'Failed to update interest'
    })

  }

})

module.exports = router