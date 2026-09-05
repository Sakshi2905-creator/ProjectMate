const express = require('express')
const Project = require('../models/Project')
const User = require('../models/User')
const Activity = require('../models/Activity')

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

// CREATE ACTIVITY
await Activity.create({
  user: owner,
  type: 'PROJECT_CREATED',
  message: 'You created a new project',
  project: project._id
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

// GET INVITATIONS FOR A USER

router.get('/invitations/:userId', async (req, res) => {

  try {

    const { userId } = req.params

    const Notification = require('../models/Notification')

    const notifications = await Notification.find({
      recipient: userId,
      type: 'project_invite',
      status: 'pending'
    })
      .populate(
        'sender',
        'name email'
      )
      .populate(
        'project',
        'title description category difficulty teamSize requiredSkills'
      )
      .sort({
        createdAt: -1
      })


    const invitations = notifications.map(
      notification => ({

        invitationId: notification._id,

        projectId:
          notification.project?._id,

        projectTitle:
          notification.project?.title,

        projectDescription:
          notification.project?.description,

        category:
          notification.project?.category,

        difficulty:
          notification.project?.difficulty,

        teamSize:
          notification.project?.teamSize,

        requiredSkills:
          notification.project?.requiredSkills || [],

        owner: notification.sender,

        message:
          notification.message,

        createdAt:
          notification.createdAt

      })
    )


    res.status(200).json({
      invitations
    })


  } catch (error) {

    console.error(
      'Fetch invitations error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch invitations'
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
// GET USER INVITATIONS

router.get('/invitations/:userId', async (req, res) => {

  try {

    const { userId } = req.params

    const projects = await Project.find({
      'joinRequests.user': userId,
      'joinRequests.status': 'pending'
    })
      .populate('owner', 'name email')


    const invitations = []

    projects.forEach(project => {

      project.joinRequests.forEach(request => {

        if (
          request.user.toString() === userId &&
          request.status === 'pending'
        ) {

          invitations.push({

            invitationId: request._id,

            projectId: project._id,

            projectTitle: project.title,

            projectDescription: project.description,

            category: project.category,

            difficulty: project.difficulty,

            teamSize: project.teamSize,

            requiredSkills: project.requiredSkills,

            owner: project.owner,

            createdAt: request.createdAt

          })

        }

      })

    })


    res.status(200).json({
      invitations
    })

  } catch (error) {

    console.error(
      'Fetch invitations error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch invitations'
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


    // Normalize required skills
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


        // Normalize user skills
        const normalizedUserSkills =
          userSkills.map(skill =>
            skill.toLowerCase().trim()
          )


        // Find matched skills
        const matchedSkills =
          requiredSkills.filter(skill =>
            normalizedUserSkills.includes(
              skill.toLowerCase().trim()
            )
          )


        // Find missing skills
        const missingSkills =
          requiredSkills.filter(skill =>
            !normalizedUserSkills.includes(
              skill.toLowerCase().trim()
            )
          )


        // Calculate skill match
        const skillMatch =
          normalizedRequiredSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length /
                  normalizedRequiredSkills.length) *
                  100
              )


        // Interest priority
        let interestScore = 0

        if (user.interest === 'join') {

          interestScore = 100

        } else if (user.interest === 'both') {

          interestScore = 80

        } else if (user.interest === 'build') {

          interestScore = 40

        }


        // Final score
        const finalScore =
          Math.round(
            skillMatch * 0.8 +
            interestScore * 0.2
          )


        return {

          _id: user._id,

          name: user.name,

          email: user.email,

          skills: user.skills,

          interest: user.interest,

          matchPercentage: skillMatch,

          finalScore,

          matchedSkills,

          missingSkills

        }

      })


      // Sort according to final score
      .sort(
        (a, b) =>
          b.finalScore -
          a.finalScore
      )


    res.status(200).json({

      project: {

        id: project._id,

        title: project.title,

        requiredSkills:
          project.requiredSkills

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

// // INVITE USER TO PROJECT

// router.post('/:projectId/invite', async (req, res) => {

//   try {

//     const { projectId } = req.params
//     const { userId } = req.body

//     if (!userId) {
//       return res.status(400).json({
//         message: 'User ID is required'
//       })
//     }

//     const project = await Project.findById(projectId)

//     if (!project) {
//       return res.status(404).json({
//         message: 'Project not found'
//       })
//     }

//     const user = await User.findById(userId)

//     if (!user) {
//       return res.status(404).json({
//         message: 'User not found'
//       })
//     }

//     // Check if already a member

//     const alreadyMember = project.members.some(
//       member =>
//         member.toString() === userId
//     )

//     if (alreadyMember) {
//       return res.status(400).json({
//         message: 'User is already a team member'
//       })
//     }

//     // Check existing pending request

//     const existingRequest =
//       project.joinRequests.find(
//         request =>
//           request.user.toString() === userId &&
//           request.status === 'pending'
//       )

//     if (existingRequest) {
//       return res.status(400).json({
//         message: 'Invitation already sent'
//       })
//     }

//     // Add invitation as pending request

//     project.joinRequests.push({
//       user: userId,
//       status: 'pending'
//     })

//     await project.save()

//     res.status(200).json({
//       message: `Invitation sent to ${user.name}`,
//       project
//     })

//   } catch (error) {

//     console.error(
//       'Invite user error:',
//       error
//     )

//     res.status(500).json({
//       message: 'Failed to send invitation'
//     })

//   }

// })
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

    // Check existing pending invitation

    const existingInvitation =
      project.invitations.find(
        invitation =>
          invitation.user.toString() === userId &&
          invitation.status === 'pending'
      )

    if (existingInvitation) {
      return res.status(400).json({
        message: 'Invitation already sent'
      })
    }

    // Create invitation

    project.invitations.push({
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

// GET USER'S PENDING INVITATIONS

router.get('/invitations/:userId', async (req, res) => {

  try {

    const { userId } = req.params

    const projects = await Project.find({
      'invitations.user': userId
    })
      .populate(
        'owner',
        'name email'
      )
      .populate(
        'invitations.user',
        'name email skills'
      )
      .sort({
        createdAt: -1
      })


    const invitations = []

    projects.forEach(project => {

      project.invitations.forEach(invitation => {

        if (
          invitation.user &&
          invitation.user._id.toString() === userId &&
          invitation.status === 'pending'
        ) {

          invitations.push({

            invitationId: invitation._id,

            projectId: project._id,

            projectTitle: project.title,

            projectDescription:
              project.description,

            category:
              project.category,

            difficulty:
              project.difficulty,

            teamSize:
              project.teamSize,

            owner:
              project.owner,

            requiredSkills:
              project.requiredSkills,

            createdAt:
              invitation.createdAt

          })

        }

      })

    })


    res.status(200).json({
      invitations
    })


  } catch (error) {

    console.error(
      'Fetch invitations error:',
      error
    )

    res.status(500).json({
      message: 'Failed to fetch invitations'
    })

  }

})

// ACCEPT PROJECT INVITATION

router.post(
  '/:projectId/invitations/:invitationId/accept',
  async (req, res) => {

    try {

      const { projectId, invitationId } = req.params

      const project = await Project.findById(projectId)

      if (!project) {

        return res.status(404).json({
          message: 'Project not found'
        })

      }

      const invitation =
        project.joinRequests.id(invitationId)

      if (!invitation) {

        return res.status(404).json({
          message: 'Invitation not found'
        })

      }

      if (invitation.status !== 'pending') {

        return res.status(400).json({
          message: 'Invitation already processed'
        })

      }

      const alreadyMember =
        project.members.some(
          member =>
            member.toString() ===
            invitation.user.toString()
        )

      if (!alreadyMember) {

        project.members.push(
          invitation.user
        )

      }

      invitation.status = 'accepted'

      await project.save()

      res.status(200).json({

        message:
          'Invitation accepted successfully! 🎉',

        project

      })

    } catch (error) {

      console.error(
        'Accept invitation error:',
        error
      )

      res.status(500).json({
        message: 'Failed to accept invitation'
      })

    }

  }
)

// REJECT PROJECT INVITATION

router.post(
  '/:projectId/invitations/:invitationId/reject',
  async (req, res) => {

    try {

      const { projectId, invitationId } = req.params

      const project =
        await Project.findById(projectId)

      if (!project) {

        return res.status(404).json({
          message: 'Project not found'
        })

      }

      const invitation =
        project.joinRequests.id(invitationId)

      if (!invitation) {

        return res.status(404).json({
          message: 'Invitation not found'
        })

      }

      if (invitation.status !== 'pending') {

        return res.status(400).json({
          message: 'Invitation already processed'
        })

      }

      invitation.status = 'rejected'

      await project.save()

      res.status(200).json({

        message:
          'Invitation rejected successfully',

        project

      })

    } catch (error) {

      console.error(
        'Reject invitation error:',
        error
      )

      res.status(500).json({
        message: 'Failed to reject invitation'
      })

    }

  }
)
module.exports = router