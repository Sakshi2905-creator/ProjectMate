
import { API } from '../config/api'

const API_URL = `${API}/tasks`

// Get the token from whichever storage contains it.
const getToken = () => {
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  )
}

// Reusable API request function.
const taskRequest = async (endpoint, options = {}) => {
  const token = getToken()

  if (!token) {
    throw new Error('Please log in to continue.')
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong.')
  }

  return data
}

// Create a task.
export const createTask = (taskData) => {
  return taskRequest('/', {
    method: 'POST',
    body: JSON.stringify(taskData)
  })
}

// Get tasks belonging to a project.
export const getProjectTasks = (projectId) => {
  return taskRequest(`/project/${projectId}`)
}

// Get tasks assigned to the logged-in user.
export const getMyTasks = () => {
  return taskRequest('/my-tasks')
}

// Update task details.
export const updateTask = (taskId, taskData) => {
  return taskRequest(`/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(taskData)
  })
}

// Update task status.
export const updateTaskStatus = (taskId, status) => {
  return taskRequest(`/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

// Delete a task.
export const deleteTask = (taskId) => {
  return taskRequest(`/${taskId}`, {
    method: 'DELETE'
  })
}
