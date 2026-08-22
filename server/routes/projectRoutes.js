const express = require('express')
const Project = require('../models/Project')
const User = require('../models/User')

const router = express.Router()


// CREATE PROJECT

router.post('/', async (req, res) => {

  try {

    const {
      title,
      description,
      category,
      difficulty,
      techStack,
      requiredSkills,
      teamSize,
      deadline,
      owner
    } = req.body


    // Basic validation

    if (
      !title ||
      !description ||
      !category ||
      !techStack ||
      !requiredSkills ||
      !teamSize ||
      !owner
    ) {

      return res.status(400).json({
        message: 'Please fill all required fields'
      })

    }


    const project = await Project.create({

      title,
      description,
      category,
      difficulty,
      techStack,
      requiredSkills,
      teamSize,
      deadline,
      owner,

      // Owner automatically becomes first member
      members: [owner]

    })


    res.status(201).json({

      message: 'Project created successfully',

      project

    })

  } catch (error) {

    console.error(error)

    res.status(500).json({

      message: 'Failed to create project'

    })

  }

})

// GET USER'S PROJECTS

router.get('/user/:userId', async (req, res) => {

  try {

    const projects = await Project.find({
      owner: req.params.userId
    }).sort({
      createdAt: -1
    })

    res.status(200).json({
      projects
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch projects'
    })

  }

})

// GET SINGLE PROJECT

router.get('/:id', async (req, res) => {

  try {

    const project = await Project.findById(
      req.params.id
    )

    if (!project) {

      return res.status(404).json({
        message: 'Project not found'
      })

    }

    res.status(200).json({
      project
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch project'
    })

  }

})

router.get('/', async (req, res) => {

  try {

    const projects = await Project.find()
      .sort({ createdAt: -1 })

    res.status(200).json({
      projects
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch projects'
    })

  }

})

// SMART MATCHING

router.get('/:projectId/match/:userId', async (req, res) => {

  try {

    const { projectId, userId } = req.params

    const project = await Project.findById(projectId)

    const user = await User.findById(userId)


    if (!project) {

      return res.status(404).json({
        message: 'Project not found'
      })

    }


    if (!user) {

      return res.status(404).json({
        message: 'User not found'
      })

    }


    const requiredSkills =
      project.requiredSkills || []

    const userSkills =
      user.skills || []


    const normalizedUserSkills =
      userSkills.map(skill =>
        skill.toLowerCase().trim()
      )


    const matchedSkills =
      requiredSkills.filter(skill =>
        normalizedUserSkills.includes(
          skill.toLowerCase().trim()
        )
      )


    const missingSkills =
      requiredSkills.filter(skill =>
        !normalizedUserSkills.includes(
          skill.toLowerCase().trim()
        )
      )


    const matchPercentage =
      requiredSkills.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length /
              requiredSkills.length) * 100
          )


    res.status(200).json({

      matchPercentage,

      matchedSkills,

      missingSkills,

      requiredSkills,

      userSkills

    })


  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Failed to calculate match'
    })

  }

})

module.exports = router