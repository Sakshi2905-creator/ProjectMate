import { useEffect, useState } from 'react'
import './TaskModal.css'

function TaskModal({ task, members = [], onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  })

  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : '',
        assignedTo: task.assignedTo?._id || ''
      })
    }
  }, [task])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await onSave({
        ...formData,
        assignedTo: formData.assignedTo || null,
        dueDate: formData.dueDate || null
      })
    } catch (err) {
      setError(err.message || 'Unable to save task.')
    }
  }

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-modal-header">
          <h2>Edit Task</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={150}
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label>Assignee</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          {error && <p className="task-error">{error}</p>}

          <div className="task-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal