import { useEffect, useMemo, useState } from 'react'
import './TaskBoard.css'
import TaskModal from './TaskModal'

import {
  createTask,
  getProjectTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../../services/taskService'

const columns = ['To Do', 'In Progress', 'Completed']

const getId = (value) => {
  if (!value) return ''
  return String(value._id || value.id || value)
}

const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

const formatDate = (date) => {
  if (!date) return 'No due date'

  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'Completed') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today
}

function TaskBoard({ projectId, members = [], projectOwnerId, onTasksChanged }) {
  const storedUser = JSON.parse(
    localStorage.getItem('user') ||
    sessionStorage.getItem('user') ||
    '{}'
  )

  const currentUserId = storedUser.id || storedUser._id
  const isOwner = String(currentUserId) === String(projectOwnerId)

  const isTaskCreator = (task) => {
    return getId(task.createdBy) === String(currentUserId)
  }

  const canEditTask = (task) => {
    return isOwner || isTaskCreator(task)
  }

  const canUpdateTaskStatus = (task) => {
    return (
      isOwner ||
      getId(task.assignedTo) === String(currentUserId)
    )
  }

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('To Do')

  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  })

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProjectTasks(projectId)
      setTasks(data.tasks || [])
    } catch (err) {
      setError(err.message || 'Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (projectId) {
      loadTasks()
    }
  }, [projectId])

  const handleCreateTask = async (e) => {
    e.preventDefault()

    try {
      setError('')

      await createTask({
        ...formData,
        projectId,
        status: selectedStatus,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null
      })

      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      })

      setSelectedStatus('To Do')
      setShowForm(false)
      await loadTasks()
      await onTasksChanged?.()
    } catch (err) {
      setError(err.message || 'Unable to create task.')
    }
  }

  const handleEditTask = async (updatedData) => {
    if (!editingTask) return

    try {
      setError('')

      await updateTask(editingTask._id, updatedData)

      setEditingTask(null)
      await loadTasks()
        await onTasksChanged?.()
    } catch (err) {
      setError(err.message || 'Unable to update task.')
    }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      setError('')

      await updateTaskStatus(taskId, status)
      await loadTasks()
      await onTasksChanged?.()
    } catch (err) {
      setError(err.message || 'Unable to update task status.')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      setError('')

      await deleteTask(taskId)
      await loadTasks()
      await onTasksChanged?.()
    } catch (err) {
      setError(err.message || 'Unable to delete task.')
    }
  }

  // TASK SUMMARY COUNTS
  const totalTasks = tasks.length

  const todoCount = tasks.filter(
    (task) => task.status === 'To Do'
  ).length

  const inProgressCount = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const completedCount = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  const overdueCount = tasks.filter(isOverdue).length

  // SEARCH, FILTER AND SORT
  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()

      result = result.filter((task) => {
        const title = task.title?.toLowerCase() || ''
        const description = task.description?.toLowerCase() || ''

        return (
          title.includes(search) ||
          description.includes(search)
        )
      })
    }

    if (priorityFilter !== 'All') {
      result = result.filter(
        (task) => task.priority === priorityFilter
      )
    }

    if (assigneeFilter !== 'All') {
      result = result.filter(
        (task) => getId(task.assignedTo) === assigneeFilter
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }

      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1

        return new Date(a.dueDate) - new Date(b.dueDate)
      }

      if (sortBy === 'priority') {
        const priorityOrder = {
          High: 3,
          Medium: 2,
          Low: 1
        }

        return (
          priorityOrder[b.priority] -
          priorityOrder[a.priority]
        )
      }

      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return result
  }, [tasks, searchTerm, priorityFilter, assigneeFilter, sortBy])

  const resetFilters = () => {
    setSearchTerm('')
    setPriorityFilter('All')
    setAssigneeFilter('All')
    setSortBy('newest')
  }

  if (loading) {
    return (
      <section className="task-board">
        <div className="task-loading">
          <div className="task-loading-spinner" />
          <p>Loading your project tasks...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="task-board">

      {/* PAGE HEADER */}
      <div className="task-board-header">
        <div>
          {/* <span className="task-eyebrow">PROJECT WORKSPACE</span> */}
          <h2>Task Management</h2>
          <p>Plan, organize and track your team's work.</p>
        </div>

        <button
          className="add-task-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {error && (
        <div className="task-error">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* TASK SUMMARY */}
      <div className="task-stats-grid">

        <div className="task-stat-card">
          <div className="task-stat-icon total-icon">▦</div>
          <div>
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon todo-icon">○</div>
          <div>
            <span>To Do</span>
            <strong>{todoCount}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon progress-icon">◷</div>
          <div>
            <span>In Progress</span>
            <strong>{inProgressCount}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon completed-icon">✓</div>
          <div>
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon overdue-icon">!</div>
          <div>
            <span>Overdue</span>
            <strong>{overdueCount}</strong>
          </div>
        </div>

      </div>

      {/* CREATE TASK FORM */}
      {showForm && (
        <form className="task-form" onSubmit={handleCreateTask}>

          <div className="task-form-heading">
            <div>
              <h3>Create a new task</h3>
              <p>Add the details and assign responsibility.</p>
            </div>
          </div>

          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <textarea
            placeholder="Describe the task..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>

          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <select
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData({ ...formData, assignedTo: e.target.value })
            }
          >
            <option value="">Unassigned</option>

            {members.map((member) => (
              <option key={getId(member)} value={getId(member)}>
                {member.name || 'Team Member'}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
          />

          <button type="submit" className="create-task-submit">
            Create Task
          </button>

        </form>
      )}

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="task-toolbar">

        <div className="task-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
        >
          <option value="All">All Assignees</option>

          {members.map((member) => (
            <option key={getId(member)} value={getId(member)}>
              {member.name || 'Team Member'}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
        </select>

        <button
          className="reset-filters-button"
          onClick={resetFilters}
          type="button"
        >
          Reset
        </button>

      </div>

      {/* KANBAN BOARD */}
      <div className="task-board-section-heading">
        <div>
          <h3>Project Board</h3>
          <p>{filteredTasks.length} tasks shown</p>
        </div>
      </div>

      <div className="task-columns">

        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column
          )

          return (
            <div
              className={`task-column ${
                column === 'To Do'
                  ? 'todo-column'
                  : column === 'In Progress'
                    ? 'progress-column'
                    : 'completed-column'
              }`}
              key={column}
            >

              <div className="task-column-header">
                <div className="task-column-title">
                  <span className={`column-indicator ${
                    column === 'To Do'
                      ? 'todo-indicator'
                      : column === 'In Progress'
                        ? 'progress-indicator'
                        : 'completed-indicator'
                  }`} />

                  <h3>{column}</h3>
                </div>

                <span className="task-column-count">
                  {columnTasks.length}
                </span>
              </div>

              <div className="task-column-content">

                {columnTasks.map((task) => {
                  const assigneeName =
                    task.assignedTo?.name || 'Unassigned'

                  const overdue = isOverdue(task)

                  return (
                    <article className="task-card" key={task._id}>

                      <div className="task-card-top">
                        <span className={`task-priority priority-${(
                          task.priority || 'Medium'
                        ).toLowerCase()}`}>
                          {task.priority || 'Medium'}
                        </span>

                        {overdue && (
                          <span className="task-overdue-badge">
                            Overdue
                          </span>
                        )}
                      </div>

                      <h4>{task.title}</h4>

                      {task.description && (
                        <p className="task-card-description">
                          {task.description}
                        </p>
                      )}

                      <div className="task-card-divider" />

                      <div className="task-card-assignee">
                        <div className="task-avatar">
                          {assigneeName === 'Unassigned'
                            ? '?'
                            : getInitials(assigneeName)}
                        </div>

                        <span>{assigneeName}</span>
                      </div>

                      <div className="task-card-due-date">
                        <span>◷</span>
                        <span className={overdue ? 'overdue-text' : ''}>
                          {formatDate(task.dueDate)}
                        </span>
                      </div>

                      {canUpdateTaskStatus(task) ? (
                        <div className="task-status-control">
                          <label htmlFor={`status-${task._id}`}>
                            Update status
                          </label>

                          <select
                            id={`status-${task._id}`}
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(
                                task._id,
                                e.target.value
                              )
                            }
                          >
                            {columns.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="task-readonly-status">
                          {task.status}
                        </span>
                      )}

                      {canEditTask(task) && (
                        <div className="task-card-actions">
                          <button
                            className="task-edit-button"
                            onClick={() => setEditingTask(task)}
                          >
                            Edit
                          </button>

                          <button
                            className="task-delete-button"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                    </article>
                  )
                })}

                {columnTasks.length === 0 && (
                  <div className="empty-column">
                    {/* <span>◇</span> */}
                    <p>No tasks in this column</p>
                  </div>
                )}

              </div>
            </div>
          )
        })}

      </div>

      {editingTask && (
        <TaskModal
          task={editingTask}
          members={members}
          onClose={() => setEditingTask(null)}
          onSave={handleEditTask}
        />
      )}

    </section>
  )
}

export default TaskBoard