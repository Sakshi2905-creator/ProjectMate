import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CompletedProjects.css'

function CompletedProjects() {
  const navigate = useNavigate()

  const [completedProjects, setCompletedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCompletedProjects = async () => {
      try {
        const storedUser =
          localStorage.getItem('user') ||
          sessionStorage.getItem('user')

        if (!storedUser) {
          navigate('/login')
          return
        }

        const user = JSON.parse(storedUser)
        const userId = user.id || user._id

        if (!userId) {
          setError('Unable to identify your account.')
          return
        }

        const response = await fetch(
          `http://localhost:5000/api/projects/completed-history/${userId}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || 'Failed to load completed projects'
          )
        }

        setCompletedProjects(data.completedProjects || [])
      } catch (err) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedProjects()
  }, [navigate])

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="completed-projects-page">

      <header className="completed-projects-header">
        <button
          className="completed-back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

        <div className="completed-heading">
          <span className="completed-label">
            YOUR ACHIEVEMENTS
          </span>

          <h1>Completed Projects</h1>

          <p>
            Every completed project is a step forward.
            Keep building!
          </p>
        </div>
      </header>

      <main className="completed-projects-container">

        <section className="completed-summary">
          <div className="completed-summary-icon">
            ✓
          </div>

          <div>
            <span>Total Completed Projects</span>

            <strong>
              {loading ? '—' : completedProjects.length}
            </strong>
          </div>
        </section>

        <section className="completed-list-section">

          <div className="completed-list-heading">
            <div>
              <h2>Your Project History</h2>
              <p>Projects successfully completed by you or your team.</p>
            </div>

            <span>
              {loading ? 'Loading...' : `${completedProjects.length} Projects`}
            </span>
          </div>

          {loading ? (
            <div className="completed-empty-state">
              Loading your completed projects...
            </div>
          ) : error ? (
            <div className="completed-error">
              {error}
            </div>
          ) : completedProjects.length === 0 ? (
            <div className="completed-empty-state">
              <div className="completed-empty-icon">🏆</div>
              <h3>No completed projects yet</h3>
              <p>
                Your completed projects will appear here.
                Start working on a project and achieve your next milestone!
              </p>

              <button onClick={() => navigate('/projects')}>
                Explore Projects
              </button>
            </div>
          ) : (
            <div className="completed-project-list">

              {completedProjects.map((project) => (
                <article
                  className="completed-project-card"
                  key={project._id}
                >
                  <div className="completed-project-icon">
                    {project.title?.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="completed-project-info">
                    <h3>{project.title}</h3>

                    <span>
                      {project.category || 'General Project'}
                    </span>
                  </div>

                  <div className="completed-project-date">
                    <small>Completed on</small>
                    <strong>
                      {formatDate(project.completedAt)}
                    </strong>
                  </div>

                  <div className="completed-check">
                    ✓
                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

      </main>
    </div>
  )
}

export default CompletedProjects