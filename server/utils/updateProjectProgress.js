const Task = require('../models/Task')
const Project = require('../models/Project')
const CompletedProject = require('../models/CompletedProject')
const saveCompletedProjectHistory = require('./saveCompletedProjectHistory')

const updateProjectProgress = async (projectId) => {
  try {
    // Count all tasks
    const totalTasks = await Task.countDocuments({
      project: projectId
    })

    // Count completed tasks
    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: 'Completed'
    })

    // Count tasks currently in progress
    const inProgressTasks = await Task.countDocuments({
      project: projectId,
      status: 'In Progress'
    })

    let progress = 0
    let status = 'Planning'

    if (totalTasks > 0) {
      progress = Math.round(
        (completedTasks / totalTasks) * 100
      )

      if (completedTasks === totalTasks) {
        status = 'Completed'
      } else if (
        inProgressTasks > 0 ||
        completedTasks > 0
      ) {
        status = 'In Progress'
      }
    }

    // Update project status and progress
    const project = await Project.findByIdAndUpdate(
      projectId,
      { progress, status },
      { new: true }
    )

    if (!project) {
      throw new Error('Project not found')
    }

    // Save project history only when project is completed
    if (status === 'Completed') {
      await saveCompletedProjectHistory(project)
    } else {
      // Remove old completed history if project is reopened
      await CompletedProject.deleteMany({
        originalProjectId: project._id
      })
    }

    return {
      progress,
      status
    }

  } catch (error) {
    console.error('Project progress update error:', error)
    throw error
  }
}

module.exports = updateProjectProgress
