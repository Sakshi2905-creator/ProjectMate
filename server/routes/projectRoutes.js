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

// REQUEST TO JOIN PROJECT

router.post('/:projectId/join', async (req, res) => {

  try {

    const { projectId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required'
      })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    // Check if user is already a member

    const alreadyMember = project.members.some(
      member => member.toString() === userId
    )

    if (alreadyMember) {
      return res.status(400).json({
        message: 'You are already a member of this project'
      })
    }

    // Check existing request

    const existingRequest =
      project.joinRequests.find(
        request =>
          request.user.toString() === userId &&
          request.status === 'pending'
      )

    if (existingRequest) {
      return res.status(400).json({
        message: 'Join request already sent'
      })
    }

    // Add request

    project.joinRequests.push({
      user: userId,
      status: 'pending'
    })

    await project.save()

    res.status(200).json({
      message: 'Join request sent successfully',
      project
    })

  } catch (error) {

    console.error(
      'Join request error:',
      error
    )

    res.status(500).json({
      message: 'Failed to send join request'
    })

  }

})

// ACCEPT JOIN REQUEST

router.post('/:projectId/join/:requestId/accept', async (req, res) => {

  try {

    const { projectId, requestId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    // Find the request

    const request = project.joinRequests.id(requestId)

    if (!request) {
      return res.status(404).json({
        message: 'Join request not found'
      })
    }

    // Check request status

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: 'This request has already been processed'
      })
    }

    // Add user to members

    const alreadyMember = project.members.some(
      member =>
        member.toString() === request.user.toString()
    )

    if (!alreadyMember) {
      project.members.push(request.user)
    }

    // Update request status

    request.status = 'accepted'

    await project.save()

    res.status(200).json({
      message: 'Join request accepted successfully',
      project
    })

  } catch (error) {

    console.error(
      'Accept request error:',
      error
    )

    res.status(500).json({
      message: 'Failed to accept join request'
    })

  }

})

// REJECT JOIN REQUEST

router.post('/:projectId/join/:requestId/reject', async (req, res) => {

  try {

    const { projectId, requestId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    // Find the request

    const request = project.joinRequests.id(requestId)

    if (!request) {
      return res.status(404).json({
        message: 'Join request not found'
      })
    }

    // Check request status

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: 'This request has already been processed'
      })
    }

    // Update request status

    request.status = 'rejected'

    await project.save()

    res.status(200).json({
      message: 'Join request rejected',
      project
    })

  } catch (error) {

    console.error(
      'Reject request error:',
      error
    )

    res.status(500).json({
      message: 'Failed to reject join request'
    })

  }

})


module.exports = router