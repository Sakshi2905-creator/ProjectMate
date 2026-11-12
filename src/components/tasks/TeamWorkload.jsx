import { useEffect, useState } from 'react'
import { getProjectTasks } from '../../services/taskService'
import './TeamWorkload.css'

function TeamWorkload({ projectId, members = [], projectOwner }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)

        const data = await getProjectTasks(projectId)
        setTasks(data.tasks || [])
        setError('')
      } catch (err) {
        setError(err.message || 'Unable to load team workload.')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadTasks()
    }
  }, [projectId])

  // Include the project owner in the team list.
  const teamMembers = [...members]

  if (projectOwner) {
    const ownerId = projectOwner._id || projectOwner

    const ownerAlreadyExists = teamMembers.some(
      member => String(member._id || member) === String(ownerId)
    )

    if (!ownerAlreadyExists) {
      teamMembers.unshift(projectOwner)
    }
  }

  const getMemberStats = (member) => {
    const memberId = member._id || member

    const memberTasks = tasks.filter(task => {
      const assignedId = task.assignedTo?._id || task.assignedTo

      return assignedId && String(assignedId) === String(memberId)
    })

    const total = memberTasks.length

    const completed = memberTasks.filter(
      task => task.status === 'Completed'
    ).length

    const inProgress = memberTasks.filter(
      task => task.status === 'In Progress'
    ).length

    const todo = memberTasks.filter(
      task => task.status === 'To Do'
    ).length

    const percentage = total > 0
      ? Math.round((completed / total) * 100)
      : 0

    return {
      total,
      completed,
      inProgress,
      todo,
      percentage
    }
  }

  if (loading) {
    return <p className="team-loading">Loading team workload...</p>
  }

  if (error) {
    return <p className="task-error">{error}</p>
  }

  return (
    <section className="team-workload">
      <div className="team-workload-header">
        <div>
          <h2>Team Workload</h2>
          <p>Track task distribution and progress of your team.</p>
        </div>

        <span className="team-member-count">
          {teamMembers.length} Members
        </span>
      </div>

      {teamMembers.length === 0 ? (
        <div className="team-empty">
          <h3>No team members found</h3>
          <p>Add members to this project to view their workload.</p>
        </div>
      ) : (
        <div className="team-workload-grid">
          {teamMembers.map((member, index) => {
            const memberId = member._id || member
            const stats = getMemberStats(member)

            const memberName = member.name || 'Team Member'
            const initial = memberName.charAt(0).toUpperCase()

            const isProjectOwner =
              projectOwner &&
              String(memberId) === String(projectOwner._id || projectOwner)

            return (
              <article
                className="team-workload-card"
                key={memberId || index}
              >
                <div className="team-member-info">
                  <div className="team-avatar">
                    {initial}
                  </div>

                  <div>
                    <h3>{memberName}</h3>
                    <p>
                      {isProjectOwner ? 'Project Owner' : 'Team Member'}
                    </p>
                  </div>
                </div>

                <div className="team-total-tasks">
                  <span>Total Assigned Tasks</span>
                  <strong>{stats.total}</strong>
                </div>

                <div className="team-task-stats">
                  <div>
                    <strong>{stats.todo}</strong>
                    <span>To Do</span>
                  </div>

                  <div>
                    <strong>{stats.inProgress}</strong>
                    <span>In Progress</span>
                  </div>

                  <div>
                    <strong>{stats.completed}</strong>
                    <span>Completed</span>
                  </div>
                </div>

                <div className="team-progress-section">
                  <div className="team-progress-heading">
                    <span>Completion</span>
                    <strong>{stats.percentage}%</strong>
                  </div>

                  <div className="team-progress-track">
                    <div
                      className="team-progress-fill"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TeamWorkload