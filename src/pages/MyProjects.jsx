import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyProjects.css'

function MyProjects() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    const storedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user')

    if (!token || !storedUser) {
      navigate('/login')
      return
    }

    const loggedInUser = JSON.parse(storedUser)

    setUser(loggedInUser)

    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/user/${loggedInUser.id}`
        )

        const data = await response.json()

        if (response.ok) {
          setProjects(data.projects || [])
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <div className="my-projects-page">

      {/* ================= NAVBAR ================= */}

      <nav className="projects-navbar">

        <div
          className="projects-brand"
          onClick={() => navigate('/dashboard')}
        >
          Project<span>Mate</span>
        </div>

        <div className="projects-nav-links">

          <button onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/discover')}>
            Discover
          </button>

          <button className="active">
            My Projects
          </button>

          <button onClick={() => navigate('/teams')}>
           Teams
          </button>

        </div>

        <div className="projects-profile">

          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{user.name}</strong>
            <small>Builder</small>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="projects-container">

        <section className="projects-header">

          <div>
            <p className="projects-label">
              YOUR WORKSPACE
            </p>

            <h1>My Projects</h1>

            <p>
              Manage and track all the projects you are building.
            </p>
          </div>

          <button
            className="create-project-btn"
            onClick={() => navigate('/create-project')}
          >
            + Create Project
          </button>

        </section>


        {/* ================= CONTENT ================= */}

        {loading ? (

          <div className="projects-loading">
            <div className="loading-spinner"></div>
            <p>Loading your projects...</p>
          </div>

        ) : projects.length === 0 ? (

          <div className="projects-empty">

            <div className="empty-icon">
              🚀
            </div>

            <h2>No projects yet</h2>

            <p>
              Start building something amazing with your teammates.
            </p>

            <button
              onClick={() => navigate('/create-project')}
            >
              Create Your First Project
            </button>

          </div>

        ) : (

          <section className="projects-grid">

            {projects.map((project) => (

              <article
                className="project-card"
                key={project._id}
              >

                {/* CARD TOP */}

                <div className="project-card-top">

                  <div className="project-avatar">
                    {project.title
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="project-title-area">

                    <h2>{project.title}</h2>

                    <span className="project-status">
                      {project.status || 'Planning'}
                    </span>

                  </div>

                </div>


                {/* DESCRIPTION */}

                <p className="project-description">
                  {project.description || 'No description available.'}
                </p>


                {/* CATEGORY */}

                <div className="project-meta">

                  <span>
                    📁 {project.category || 'General'}
                  </span>

                  <span>
                    🎯 {project.difficulty || 'Intermediate'}
                  </span>

                </div>


                {/* TECH STACK */}

                <div className="project-skills">

                  {(project.techStack || [])
                    .slice(0, 5)
                    .map((tech, index) => (

                      <span key={index}>
                        {tech}
                      </span>

                    ))}

                </div>


                {/* FOOTER */}

                <div className="project-card-footer">

                  <div className="project-members">

                    👥 {project.members?.length || 0}
                    {' '}
                    members

                  </div>

                  <button
                    onClick={() =>
                      navigate(`/project/${project._id}`)
                    }
                  >
                    View Project →
                  </button>

                </div>

              </article>

            ))}

          </section>

        )}

      </main>

    </div>
  )
}

export default MyProjects