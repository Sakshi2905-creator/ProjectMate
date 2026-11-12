
const Task = require('../models/Task')
const Project = require('../models/Project')
const Activity = require('../models/Activity')
const updateProjectProgress = require('../utils/updateProjectProgress')

// Check whether a user belongs to a project.
const isProjectMember = (project, userId) => {
  const isOwner = project.owner.toString() === userId.toString()

  const isMember = project.members.some(
    member => member.toString() === userId.toString()
  )

  return isOwner || isMember
}

// CREATE ACTIVITY LOG
const logTaskActivity = async (userId, projectId, taskId, type, message) => {
  await Activity.create({
    user: userId,
    project: projectId,
    task: taskId,
    type,
    message
  })
}

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      assignedTo,
      status,
      priority,
      dueDate
    } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: 'Task title is required.'
      })
    }

    if (!projectId) {
      return res.status(400).json({
        message: 'Project ID is required.'
      })
    }

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      })
    }

    const userId = req.user.userId

    if (!isProjectMember(project, userId)) {
      return res.status(403).json({
        message: 'Only project members can create tasks.'
      })
    }

    // An assigned user must be an actual project member or owner.
    if (assignedTo) {
      const isValidAssignee = isProjectMember(project, assignedTo)

      if (!isValidAssignee) {
        return res.status(400).json({
          message: 'Assignee must belong to this project.'
        })
      }
    }

    const allowedStatuses = ['To Do', 'In Progress', 'Completed']
    const allowedPriorities = ['Low', 'Medium', 'High']

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid task status.'
      })
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: 'Invalid task priority.'
      })
    }

    const taskStatus = status || 'To Do'

    const task = await Task.create({
      title: title.trim(),
      description,
      project: projectId,
      assignedTo: assignedTo || null,
      createdBy: userId,
      status: taskStatus,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      completedAt: taskStatus === 'Completed' ? new Date() : null
    })
    await updateProjectProgress(projectId)

    await logTaskActivity(
  userId,
  projectId,
  task._id,
  'TASK_CREATED',
  `Created task: ${task.title}`
)

if (assignedTo) {
  await logTaskActivity(
    userId,
    projectId,
    task._id,
    'TASK_ASSIGNED',
    `Assigned task "${task.title}" to a team member`
  )
}

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')

    return res.status(201).json({
      message: 'Task created successfully.',
      task: populatedTask
    })
  } catch (error) {
    console.error('Create task error:', error)

    return res.status(500).json({
      message: 'Server error while creating task.'
    })
  }
}

// GET ALL TASKS FOR A PROJECT
const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user.userId

    const project = await Project.findById(projectId)

    if (!project) {
      return res.status(404).json({
        message: 'Project not found.'
      })
    }

    if (!isProjectMember(project, userId)) {
      return res.status(403).json({
        message: 'You are not allowed to view these tasks.'
      })
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      count: tasks.length,
      tasks
    })
  } catch (error) {
    console.error('Get project tasks error:', error)

    return res.status(500).json({
      message: 'Server error while fetching tasks.'
    })
  }
}


// UPDATE TASK DETAILS
// Only the task creator or project owner can edit task details.
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const { title, description, assignedTo, priority, dueDate } = req.body
    const userId = req.user.userId

    const task = await Task.findById(taskId)
    const previousAssignee = task?.assignedTo
  ? task.assignedTo.toString()
  : null

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }

    if (!isProjectMember(project, userId)) {
  return res.status(403).json({
    message: 'You must be a current project member to edit tasks.'
  })
}

    const isOwner = project.owner.toString() === userId.toString()
    const isCreator = task.createdBy.toString() === userId.toString()

    if (!isOwner && !isCreator) {
      return res.status(403).json({
        message: 'Only the task creator or project owner can edit task details.'
      })
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: 'Task title cannot be empty.'
        })
      }
      task.title = title.trim()
    }

    if (description !== undefined) task.description = description

    if (priority !== undefined) {
      if (!['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority.' })
      }
      task.priority = priority
    }

    if (dueDate !== undefined) task.dueDate = dueDate || null

    if (assignedTo !== undefined) {
      if (assignedTo) {
        if (!isProjectMember(project, assignedTo)) {
          return res.status(400).json({
            message: 'Assignee must belong to this project.'
          })
        }
        task.assignedTo = assignedTo
      } else {
        task.assignedTo = null
      }
    }

    await task.save()
const newAssignee = task.assignedTo
  ? task.assignedTo.toString()
  : null

if (previousAssignee !== newAssignee) {
  await logTaskActivity(
    userId,
    task.project,
    task._id,
    newAssignee ? 'TASK_REASSIGNED' : 'TASK_UNASSIGNED',
    newAssignee
      ? `Reassigned task "${task.title}" to a team member`
      : `Removed the assignee from task "${task.title}"`
  )
}
    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')

    return res.status(200).json({
      message: 'Task updated successfully.',
      task: updatedTask
    })
  } catch (error) {
    console.error('Update task error:', error)
    return res.status(500).json({
      message: 'Server error while updating task.'
    })
  }
}

// UPDATE TASK STATUS
// Only the assigned member or project owner can change task status.
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params
    const { status } = req.body
    const userId = req.user.userId

    const allowedStatuses = ['To Do', 'In Progress', 'Completed']

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status.' })
    }

    const task = await Task.findById(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }

        if (!isProjectMember(project, userId)) {
      return res.status(403).json({
        message: 'You are no longer a member of this project.'
      })
    }

    const isOwner = project.owner.toString() === userId.toString()
    const isAssignee =
      task.assignedTo &&
      task.assignedTo.toString() === userId.toString()

    if (!isOwner && !isAssignee) {
      return res.status(403).json({
        message: 'Only the assigned member or project owner can update status.'
      })
    }
const previousStatus = task.status

task.status = status
task.completedAt = status === 'Completed' ? new Date() : null

await task.save()

if (previousStatus !== status) {
  let activityType = 'TASK_STATUS_UPDATED'

  if (status === 'Completed') {
    activityType = 'TASK_COMPLETED'
  } else if (previousStatus === 'Completed') {
    activityType = 'TASK_REOPENED'
  }

  await logTaskActivity(
    userId,
    task.project,
    task._id,
    activityType,
    `Changed task "${task.title}" from ${previousStatus} to ${status}`
  )
}

await updateProjectProgress(task.project)

    return res.status(200).json({
      message: 'Task status updated successfully.',
      task
    })
  } catch (error) {
    console.error('Update task status error:', error)
    return res.status(500).json({
      message: 'Server error while updating task status.'
    })
  }
}

// DELETE TASK
// Only the task creator or project owner can delete a task.
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params
    const userId = req.user.userId

    const task = await Task.findById(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' })
    }

    const project = await Project.findById(task.project)

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }

   if (!isProjectMember(project, userId)) {
  return res.status(403).json({
    message: 'You must be a current project member to delete tasks.'
  })
}

const isOwner = project.owner.toString() === userId.toString()
const isCreator = task.createdBy.toString() === userId.toString()

if (!isOwner && !isCreator) {
  return res.status(403).json({
    message: 'Only the task creator or project owner can delete this task.'
  })
}

  await logTaskActivity(
  userId,
  task.project,
  task._id,
  'TASK_DELETED',
  `Deleted task: ${task.title}`
)

await Task.findByIdAndDelete(taskId)
await updateProjectProgress(task.project)

    return res.status(200).json({
      message: 'Task deleted successfully.'
    })
  } catch (error) {
    console.error('Delete task error:', error)
    return res.status(500).json({
      message: 'Server error while deleting task.'
    })
  }
}

// GET TASKS ASSIGNED TO THE LOGGED-IN USER
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.userId

    const tasks = await Task.find({ assignedTo: userId })
      .populate('project', 'title status')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1, createdAt: -1 })

    return res.status(200).json({
      count: tasks.length,
      tasks
    })
  } catch (error) {
    console.error('Get my tasks error:', error)
    return res.status(500).json({
      message: 'Server error while fetching your tasks.'
    })
  }
}

module.exports = {
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyTasks
}
