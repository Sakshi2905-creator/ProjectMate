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
).populate(
  'members',
  'name email skills'
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
// GET JOIN REQUESTS FOR A PROJECT

router.get('/:projectId/join-requests', async (req, res) => {

  try {

    const project = await Project.findById(
      req.params.projectId
    ).populate(
      'joinRequests.user',
      'name email skills'
    )

    if (!project) {

      return res.status(404).json({
        message: 'Project not found'
      })

    }

    const requests = project.joinRequests.filter(
      request => request.status === 'pending'
    )

    res.status(200).json({
      requests
    })

  } catch (error) {

    console.error(
      'Fetch join requests error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch join requests'
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

// // GET JOIN REQUESTS FOR A PROJECT

// router.get('/:projectId/join-requests', async (req, res) => {

//   try {

//     const project = await Project.findById(
//       req.params.projectId
//     ).populate(
//       'joinRequests.user',
//       'name email skills'
//     )

//     if (!project) {
//       return res.status(404).json({
//         message: 'Project not found'
//       })
//     }

//     const pendingRequests =
//       project.joinRequests.filter(
//         request => request.status === 'pending'
//       )

//     res.status(200).json({
//       requests: pendingRequests
//     })

//   } catch (error) {

//     console.error(
//       'Fetch join requests error:',
//       error
//     )

//     res.status(500).json({
//       message: 'Failed to fetch join requests'
//     })

//   }

// })

// GET ALL PENDING JOIN REQUESTS FOR PROJECT OWNER

router.get('/join-requests/:userId', async (req, res) => {

  try {

    const projects = await Project.find({
      owner: req.params.userId
    })
      .populate(
        'joinRequests.user',
        'name email skills'
      )
      .sort({
        createdAt: -1
      })

    const requests = []

    projects.forEach(project => {

      project.joinRequests.forEach(request => {

        if (request.status === 'pending') {

          requests.push({
            requestId: request._id,
            projectId: project._id,
            projectTitle: project.title,
            user: request.user,
            createdAt: request.createdAt
          })

        }

      })

    })

    res.status(200).json({
      requests
    })

  } catch (error) {

    console.error(
      'Fetch owner join requests error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch join requests'
    })

  }

})

// UPDATE PROJECT

router.put('/:id', async (req, res) => {

  try {

    const {
      title,
      description,
      category,
      difficulty,
      techStack,
      requiredSkills,
      teamSize,
      deadline
    } = req.body

    const project = await Project.findById(
      req.params.id
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }

    project.title = title
    project.description = description
    project.category = category
    project.difficulty = difficulty
    project.techStack = techStack
    project.requiredSkills = requiredSkills
    project.teamSize = teamSize
    project.deadline = deadline

    await project.save()

    res.status(200).json({
      message: 'Project updated successfully',
      project
    })

  } catch (error) {

    console.error(
      'Update project error:',
      error
    )

    res.status(500).json({
      message: 'Failed to update project'
    })

  }

})
// FIND BEST TEAMMATES

router.get('/:projectId/find-teammates', async (req, res) => {

  try {

    const { projectId } = req.params

    // Find project
    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found'
      })
    }


    // Get all users
    const users = await User.find()
      .select('name email skills interest')


    const requiredSkills =
      project.requiredSkills || []


    // Normalize project skills
    const normalizedRequiredSkills =
      requiredSkills.map(skill =>
        skill.toLowerCase().trim()
      )


    // Existing project members
    const existingMembers =
      project.members.map(member =>
        member.toString()
      )


    const teammates = users

      // Remove project owner
      .filter(user =>
        user._id.toString() !==
        project.owner.toString()
      )

      // Remove existing members
      .filter(user =>
        !existingMembers.includes(
          user._id.toString()
        )
      )

      // Calculate matching
      .map(user => {

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
          normalizedRequiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length /
                  normalizedRequiredSkills.length) *
                  100
              )


        return {

          _id: user._id,

          name: user.name,

          email: user.email,

          skills: user.skills,

          interest: user.interest,

          matchPercentage,

          matchedSkills,

          missingSkills

        }

      })


      // Highest match first

      .sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      )


    res.status(200).json({

      project: {
        id: project._id,
        title: project.title,
        requiredSkills: project.requiredSkills
      },

      teammates

    })


  } catch (error) {

    console.error(
      'Find teammates error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to find teammates'

    })

  }

})

// INVITE USER TO PROJECT

router.post('/:projectId/invite', async (req, res) => {

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

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // Check if already a member

    const alreadyMember = project.members.some(
      member =>
        member.toString() === userId
    )

    if (alreadyMember) {
      return res.status(400).json({
        message: 'User is already a team member'
      })
    }

    // Check existing pending request

    const existingRequest =
      project.joinRequests.find(
        request =>
          request.user.toString() === userId &&
          request.status === 'pending'
      )

    if (existingRequest) {
      return res.status(400).json({
        message: 'Invitation already sent'
      })
    }

    // Add invitation as pending request

    project.joinRequests.push({
      user: userId,
      status: 'pending'
    })

    await project.save()

    res.status(200).json({
      message: `Invitation sent to ${user.name}`,
      project
    })

  } catch (error) {

    console.error(
      'Invite user error:',
      error
    )

    res.status(500).json({
      message: 'Failed to send invitation'
    })

  }

})
module.exports = router