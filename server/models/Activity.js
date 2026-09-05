const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      required: true
    },

    message: {
      type: String,
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Activity', activitySchema)