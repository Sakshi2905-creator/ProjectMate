const express = require('express')
const User = require('../models/User')

const router = express.Router()


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


module.exports = router