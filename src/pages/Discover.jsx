import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Discover.css'

function Discover() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState({})

  // ================================
  // CHECK LOGIN + GET USER
  // ================================
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

    try {
      const loggedInUser = JSON.parse(storedUser)
      setUser(loggedInUser)
    } catch (error) {
      console.error('Error reading user:', error)
      navigate('/login')
    }
  }, [navigate])

  // ================================
  // FETCH PROJECTS
  // ================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/projects'
        )

        const data = await response.json()

        if (response.ok) {
          setProjects(data.projects || [])
        } else {
          setError(data.message || 'Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError('Unable to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // ================================
  // FETCH MATCH PERCENTAGES
  // ================================
  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.id || projects.length === 0) {
        return
      }

      const matchResults = {}

      for (const project of projects) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/projects/${project._id}/match/${user.id}`
          )

          const data = await response.json()

          if (response.ok) {
            matchResults[project._id] =
              data.matchPercentage
          }
        } catch (error) {
          console.error(
            'Error calculating match:',
            error
          )
        }
      }

      setMatches(matchResults)
    }

    fetchMatches()
  }, [projects, user])

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    navigate('/login')
  }

  // ================================
  // LOADING
  // ================================
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="discover-page">

        {/* NAVBAR */}
        <nav className="discover-navbar">

          <div
            className="discover-brand"
            onClick={() => navigate('/dashboard')}
          >
            Project<span>Mate</span>
          </div>

          <div className="discover-nav-links">

            <button
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <button className="active">
              Discover
            </button>

            <button
              onClick={() => navigate('/my-projects')}
            >
              My Projects
            </button>

            <button
              onClick={() => navigate('/teams')}
            >
              Teams
            </button>

          </div>

          <div className="discover-profile">

            <div className="discover-user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="discover-user-info">
              <strong>{user.name}</strong>
              <small>Builder</small>
            </div>

            <button
              className="discover-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </nav>

        <div className="discover-loading">
          <p>Finding projects for you...</p>
        </div>

      </div>
    )
  }

  return (
    <div className="discover-page">

      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="discover-navbar">

        {/* LOGO */}

        <div
          className="discover-brand"
          onClick={() => navigate('/dashboard')}
        >
          Project<span>Mate</span>
        </div>


        {/* NAVIGATION LINKS */}

        <div className="discover-nav-links">

          <button
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button className="active">
            Discover
          </button>

          <button
            onClick={() => navigate('/projects')}
            >
            My Projects
          </button>

          <button
            onClick={() => navigate('/teams')}
          >
            Teams
          </button>

        </div>


        {/* USER PROFILE */}

        <div className="discover-profile">

          <div className="discover-user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="discover-user-info">
            <strong>{user.name}</strong>
            <small>Builder</small>
          </div>

          <button
            className="discover-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================
          HEADER
      ================================= */}

      <header className="discover-header">

        <div>

          <span className="discover-label">
            EXPLORE
          </span>

          <h1>
            Discover Projects
          </h1>

          <p>
            Find projects where your skills
            can make an impact.
          </p>

        </div>

      </header>


      {/* =================================
          PROJECTS
      ================================= */}

      <main className="discover-container">

        {error && (
          <div className="discover-error">
            {error}
          </div>
        )}

        {projects.length === 0 ? (

          <div className="empty-discover">

            <h2>
              No projects found
            </h2>

            <p>
              Be the first to create a project.
            </p>

            <button
              onClick={() =>
                navigate('/create-project')
              }
            >
              + Create Project
            </button>

          </div>

        ) : (

          <div className="discover-grid">

            {projects.map(project => (

              <article
                className="discover-card"
                key={project._id}
              >

                {/* CARD TOP */}

                <div className="discover-card-top">

                  <div className="discover-logo">
                    {project.title
                      ?.substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <span className="difficulty">
                    {project.difficulty}
                  </span>

                  {matches[project._id] !== undefined && (
                    <span className="match-score">
                      ⚡ {matches[project._id]}% Match
                    </span>
                  )}

                </div>


                {/* CATEGORY */}

                <span className="category">
                  {project.category}
                </span>


                {/* TITLE */}

                <h2>
                  {project.title}
                </h2>


                {/* DESCRIPTION */}

                <p>
                  {project.description}
                </p>


                {/* TECH STACK */}

                <div className="discover-tags">

                  {project.techStack?.map(
                    (tech, index) => (

                      <span key={index}>
                        {tech}
                      </span>

                    )
                  )}

                </div>


                {/* FOOTER */}

                <div className="discover-card-footer">

                  <div>

                    <small>
                      Team
                    </small>

                    <strong>
                      {project.members?.length || 0}
                      {' / '}
                      {project.teamSize}
                    </strong>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/project/${project._id}`
                      )
                    }
                  >
                    View Project →
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Discover