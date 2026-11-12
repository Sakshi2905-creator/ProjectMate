const Activity = require('../models/Activity')
const Project = require('../models/Project')

const getRecentActivities = async (req, res) => {

  try {

    const userId = req.params.userId

    const activities = await Activity.find({
      user: userId
    })
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({
      activities
    })

  } catch (error) {

    console.error(
      'Activity error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}

const getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user.userId

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      })
    }

    const isOwner =
      project.owner.toString() === userId.toString()

    const isMember = project.members.some(
      member => member.toString() === userId.toString()
    )

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: 'You are not a member of this project.'
      })
    }

    const activities = await Activity.find({
      project: projectId
    })
      .populate('user', 'name')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(50)

    res.status(200).json({
      activities
    })

  } catch (error) {
    console.error('Project activity error:', error)

    res.status(500).json({
      message: 'Server error while fetching project activities.'
    })
  }
}

module.exports = {
  getRecentActivities,
   getProjectActivities
}