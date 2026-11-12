
import { useEffect, useState } from 'react'
import { getProjectActivities } from '../../services/activityService'
import './ActivityFeed.css'

const getActivityMeta = (message = '') => {
  const text = message.toLowerCase()

  if (text.includes('completed') || text.includes('to completed')) {
    return { icon: '✓', label: 'Completed', className: 'activity-completed' }
  }

  if (text.includes('assigned')) {
    return { icon: '↗', label: 'Assignment', className: 'activity-assigned' }
  }

  if (text.includes('created task')) {
    return { icon: '+', label: 'Task created', className: 'activity-created' }
  }

  if (text.includes('join request') && text.includes('rejected')) {
    return { icon: '×', label: 'Request rejected', className: 'activity-rejected' }
  }

  if (text.includes('join request') || text.includes('requested to join')) {
    return { icon: '↗', label: 'Join request', className: 'activity-request' }
  }

  if (text.includes('joined')) {
    return { icon: '✓', label: 'Member joined', className: 'activity-joined' }
  }

  if (text.includes('deleted')) {
    return { icon: '−', label: 'Deleted', className: 'activity-deleted' }
  }

  if (text.includes('changed') || text.includes('updated')) {
    return { icon: '↻', label: 'Updated', className: 'activity-updated' }
  }

  return { icon: '•', label: 'Activity', className: 'activity-default' }
}

const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('') || 'U'
}

const formatActivityDate = (date) => {
  if (!date) return 'Date unavailable'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable'
  }

  return parsedDate.toLocaleString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const ActivityFeed = ({ projectId }) => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getProjectActivities(projectId)
        setActivities(Array.isArray(data) ? data : data.activities || [])
      } catch (err) {
        setError(err.message || 'Unable to load project activities.')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      loadActivities()
    }
  }, [projectId])

  if (loading) {
    return (
      <div className="activity-state">
        <div className="activity-spinner"></div>
        <p>Loading project activity...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="activity-state activity-state-error">
        <span className="activity-state-icon">!</span>
        <h3>Couldn't load activities</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <section className="activity-feed">
      <div className="activity-feed-header">
        <div>
          {/* <span className="activity-eyebrow">PROJECT HISTORY</span> */}
          <h2>Project Activity</h2>
          <p>Keep track of updates and actions across your project.</p>
        </div>

        <div className="activity-count">
          <strong>{activities.length}</strong>
          <span>{activities.length === 1 ? 'Activity' : 'Activities'}</span>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="activity-empty">
          <div className="activity-empty-icon">↻</div>
          <h3>No activities yet</h3>
          <p>
            Project updates, task changes and team actions
            will appear here.
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => {
            const userName = activity.user?.name || 'A team member'
            const meta = getActivityMeta(activity.message)

            return (
              <article
                className="activity-item"
                key={activity._id}
              >
                <div className="activity-timeline">
                  <div className={`activity-dot ${meta.className}`}>
                    {meta.icon}
                  </div>
                </div>

                <div className="activity-card">
                  <div className="activity-user-avatar">
                    {getInitials(userName)}
                  </div>

                  <div className="activity-content">
                    <div className="activity-card-top">
                      <div className="activity-user-info">
                        <strong>{userName}</strong>
                        <span>{formatActivityDate(activity.createdAt)}</span>
                      </div>

                      <span className={`activity-type ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>

                    <p className="activity-description">
                      {activity.message || 'Updated the project.'}
                    </p>

                    {activity.task?.title && (
                      <div className="activity-task">
                        <span className="activity-task-icon">▤</span>
                        <span>Task:</span>
                        <strong>{activity.task.title}</strong>
                      </div>
                    )}
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

export default ActivityFeed
