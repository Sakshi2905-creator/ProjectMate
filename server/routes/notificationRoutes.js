const express = require('express')
const mongoose = require('mongoose')

const Notification = require('../models/Notification')
const Project = require('../models/Project')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// All notification routes require authentication.
router.use(authMiddleware)

// SEND PROJECT INVITATION
router.post('/invite', async (req, res) => {
  try {
    // Sender identity must come from the verified JWT.
    const senderId = req.user.userId
    const { recipientId, projectId } = req.body

    if (
      !mongoose.isValidObjectId(recipientId) ||
      !mongoose.isValidObjectId(projectId)
    ) {
      return res.status(400).json({
        message: 'Invalid recipient or project ID.'
      })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      })
    }

    // Only the project owner can send invitations.
    if (project.owner.toString() !== senderId.toString()) {
      return res.status(403).json({
        message: 'Only the project owner can send invitations.'
      })
    }

    const recipient = await User.findById(recipientId)

    if (!recipient) {
      return res.status(404).json({
        message: 'Recipient not found.'
      })
    }

    if (recipientId.toString() === senderId.toString()) {
      return res.status(400).json({
        message: 'You cannot invite yourself.'
      })
    }

    const alreadyMember = project.members.some(
      member => member.toString() === recipientId.toString()
    )

    if (alreadyMember) {
      return res.status(400).json({
        message: 'This user is already a project member.'
      })
    }

    // Prevent invitations when the team is full.
    if (project.members.length >= project.teamSize) {
      return res.status(400).json({
        message: 'Team size is full.'
      })
    }

    const existingNotification = await Notification.findOne({
      sender: senderId,
      recipient: recipientId,
      project: projectId,
      type: 'project_invite',
      status: 'pending'
    })

    if (existingNotification) {
      return res.status(400).json({
        message: 'Invitation already sent.'
      })
    }

    const notification = await Notification.create({
      sender: senderId,
      recipient: recipientId,
      project: projectId,
      type: 'project_invite'
    })

    return res.status(201).json({
      message: 'Invitation sent successfully.',
      notification
    })

  } catch (error) {
    console.error('Send invitation error:', error)

    return res.status(500).json({
      message: 'Failed to send invitation.'
    })
  }
})

// GET LOGGED-IN USER'S NOTIFICATIONS
router.get('/:userId', async (req, res) => {
  try {
    const loggedInUserId = req.user.userId
    const { userId } = req.params

    // A user can only access their own notifications.
    if (userId !== loggedInUserId.toString()) {
      return res.status(403).json({
        message: 'You can only access your own notifications.'
      })
    }

    const notifications = await Notification.find({
      recipient: loggedInUserId
    })
      .populate('sender', 'name')
      .populate('project', 'title')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      notifications
    })

  } catch (error) {
    console.error('Fetch notifications error:', error)

    return res.status(500).json({
      message: 'Failed to fetch notifications.'
    })
  }
})

module.exports = router