const mongoose = require('mongoose')

const completedProjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    originalProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      default: ''
    },

    completedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// One history entry per user for each project
completedProjectSchema.index(
  { user: 1, originalProjectId: 1 },
  { unique: true }
)

module.exports = mongoose.model(
  'CompletedProject',
  completedProjectSchema
)