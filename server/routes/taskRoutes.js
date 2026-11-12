
const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const {
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyTasks
} = require('../controllers/taskController')

// Protect every task API.
router.use(authMiddleware)

// Create a task.
router.post('/', createTask)

// Get tasks for a project.
router.get('/project/:projectId', getProjectTasks)

// Get tasks assigned to the logged-in user.
// Keep this route before routes containing taskId.
router.get('/my-tasks', getMyTasks)

// Update task details.
router.put('/:taskId', updateTask)

// Update task status.
router.patch('/:taskId/status', updateTaskStatus)

// Delete a task.
router.delete('/:taskId', deleteTask)

module.exports = router
