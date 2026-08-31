const express = require('express')
const Notification = require('../models/Notification')
const User = require('../models/User')
const Project = require('../models/Project')

const router = express.Router()


// CREATE PROJECT INVITATION

router.post('/invite', async (req, res) => {

  try {

    const {
      senderId,
      recipientId,
      projectId
    } = req.body


    // Validate required fields

    if (
      !senderId ||
      !recipientId ||
      !projectId
    ) {

      return res.status(400).json({
        message: 'Missing required information'
      })

    }


    // Check sender

    const sender = await User.findById(senderId)

    if (!sender) {

      return res.status(404).json({
        message: 'Sender not found'
      })

    }


    // Check recipient

    const recipient =
      await User.findById(recipientId)

    if (!recipient) {

      return res.status(404).json({
        message: 'Recipient not found'
      })

    }


    // Check project

    const project =
      await Project.findById(projectId)

    if (!project) {

      return res.status(404).json({
        message: 'Project not found'
      })

    }


    // Prevent inviting yourself

    if (
      senderId.toString() ===
      recipientId.toString()
    ) {

      return res.status(400).json({
        message: 'You cannot invite yourself'
      })

    }


    // Check if already a member

    const alreadyMember =
      project.members.some(
        member =>
          member.toString() ===
          recipientId.toString()
      )

    if (alreadyMember) {

      return res.status(400).json({
        message: 'User is already a project member'
      })

    }


    // Check existing pending invitation

    const existingNotification =
      await Notification.findOne({

        sender: senderId,

        recipient: recipientId,

        project: projectId,

        type: 'project_invite',

        status: 'pending'

      })


    if (existingNotification) {

      return res.status(400).json({
        message: 'Invitation already sent'
      })

    }


    // Create notification

    const notification =
      await Notification.create({

        sender: senderId,

        recipient: recipientId,

        project: projectId,

        type: 'project_invite',

        message:
          `${sender.name} invited you to join ${project.title}`

      })


    res.status(201).json({

      message: 'Invitation sent successfully',

      notification

    })


  } catch (error) {

    console.error(
      'Invite error:',
      error
    )

    res.status(500).json({

      message:
        'Failed to send invitation'

    })

  }

})

// GET NOTIFICATIONS FOR USER

router.get('/:userId', async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        recipient: req.params.userId
      })
      .populate(
        'sender',
        'name email'
      )
      .populate(
        'project',
        'title description'
      )
      .sort({
        createdAt: -1
      })


    res.status(200).json({
      notifications
    })


  } catch (error) {

    console.error(
      'Fetch notifications error:',
      error
    )

    res.status(500).json({
      message:
        'Failed to fetch notifications'
    })

  }

})

module.exports = router