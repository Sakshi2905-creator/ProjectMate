
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    // Basic task information
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 2000
    },

    // Project to which this task belongs
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    // Member responsible for completing this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    // User who created this task
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Task status
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Completed'],
      default: 'To Do'
    },

    // Task priority
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    // Task deadline
    dueDate: {
      type: Date,
      default: null
    },

    // Completion timestamp
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

// Improve queries for project tasks and personal tasks
taskSchema.index({ project: 1, status: 1 })
taskSchema.index({ assignedTo: 1, status: 1 })

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
