const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    type: {
      type: String,
      enum: ['project_invite'],
      default: 'project_invite'
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },

    read: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Notification =
  mongoose.model('Notification', notificationSchema)

module.exports = Notification