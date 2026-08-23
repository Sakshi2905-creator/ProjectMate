import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Discover.css'

function Discover() {

  const navigate = useNavigate()
  const storedUser = JSON.parse(
  localStorage.getItem('user')
)

const userId = storedUser?.id

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState({})

  useEffect(() => {

    const fetchProjects = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/projects'
        )

        const data = await response.json()

        if (response.ok) {
          setProjects(data.projects || [])
        }

      } catch (error) {

        console.error(
          'Error fetching projects:',
          error
        )

      } finally {

        setLoading(false)

      }

    }

    fetchProjects()

  }, [])

useEffect(() => {

  const fetchMatches = async () => {

    if (!userId || projects.length === 0) {
      return
    }

    const matchResults = {}

    for (const project of projects) {

      try {

        const response = await fetch(
          `http://localhost:5000/api/projects/${project._id}/match/${userId}`
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

}, [projects, userId])

  if (loading) {

    return (
      <div className="discover-page">
        <p>Finding projects for you...</p>
      </div>
    )

  }


  return (

    <div className="discover-page">

      {/* HEADER */}

      <header className="discover-header">

        <button
          className="discover-back"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

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


      {/* PROJECTS */}

      <main className="discover-container">

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

                <div className="discover-card-top">

                  <div className="discover-logo">
                    {project.title
                      .substring(0, 2)
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


                <span className="category">
                  {project.category}
                </span>


                <h2>
                  {project.title}
                </h2>


                <p>
                  {project.description}
                </p>


                <div className="discover-tags">

                  {project.techStack?.map(
                    (tech, index) => (

                      <span key={index}>
                        {tech}
                      </span>

                    )
                  )}

                </div>


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