const Task = require('../models/Task')
const Project = require('../models/Project')

const updateProjectProgress = async (projectId) => {
  try {
    const totalTasks = await Task.countDocuments({
      project: projectId
    })

    const completedTasks = await Task.countDocuments({
      project: projectId,
      status: 'Completed'
    })

    let progress = 0
    let status = 'Planning'

    if (totalTasks > 0) {
      progress = Math.round(
        (completedTasks / totalTasks) * 100
      )

      if (completedTasks === totalTasks) {
        status = 'Completed'
      } else if (completedTasks > 0) {
        status = 'In Progress'
      }
    }

    await Project.findByIdAndUpdate(projectId, {
      progress,
      status
    })

    return { progress, status }
  } catch (error) {
    console.error('Project progress update error:', error)
    throw error
  }
}

module.exports = updateProjectProgress