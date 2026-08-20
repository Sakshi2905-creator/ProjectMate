import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ProjectDetails.css'

function ProjectDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  useEffect(() => {

    const fetchProject = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || 'Project not found')
          return
        }

        setProject(data.project)

      } catch (error) {

        console.error(error)

        setError(
          'Unable to load project'
        )

      } finally {

        setLoading(false)

      }

    }


    fetchProject()

  }, [id])


  if (loading) {

    return (
      <div className="project-details-page">
        <div className="project-details-loading">
          Loading project...
        </div>
      </div>
    )

  }


  if (error || !project) {

    return (
      <div className="project-details-page">

        <div className="project-details-error">

          <h2>
            Project not found
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    )

  }


  return (

    <div className="project-details-page">


      {/* HEADER */}

      <header className="project-details-header">

        <button
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>

        <span className="project-status">
          {project.status}
        </span>

      </header>


      <main className="project-details-container">


        {/* PROJECT HERO */}

        <section className="project-details-hero">

          <div className="project-details-logo">
            {project.title
              .substring(0, 2)
              .toUpperCase()}
          </div>


          <div className="project-details-title">

            <span className="project-category">
              {project.category}
            </span>

            <h1>
              {project.title}
            </h1>

            <p>
              {project.description}
            </p>

          </div>

        </section>


        {/* PROJECT INFO */}

        <section className="project-info-grid">


          <div className="info-card">

            <span>
              Difficulty
            </span>

            <strong>
              {project.difficulty}
            </strong>

          </div>


          <div className="info-card">

            <span>
              Team Size
            </span>

            <strong>
              {project.teamSize}
            </strong>

          </div>


          <div className="info-card">

            <span>
              Members
            </span>

            <strong>
              {project.members?.length || 0}
            </strong>

          </div>


          <div className="info-card">

            <span>
              Deadline
            </span>

            <strong>
              {new Date(
                project.deadline
              ).toLocaleDateString(
                'en-IN',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }
              )}
            </strong>

          </div>


        </section>


        {/* MAIN CONTENT */}

        <div className="project-details-grid">


          {/* LEFT */}

          <div>


            {/* DESCRIPTION */}

            <section className="details-card">

              <h2>
                About this project
              </h2>

              <p>
                {project.description}
              </p>

            </section>


            {/* TECH STACK */}

            <section className="details-card">

              <h2>
                Tech Stack
              </h2>

              <div className="details-tags">

                {project.techStack?.map(
                  (tech, index) => (

                    <span key={index}>
                      {tech}
                    </span>

                  )
                )}

              </div>

            </section>


            {/* REQUIRED SKILLS */}

            <section className="details-card">

              <h2>
                Required Skills
              </h2>

              <div className="details-tags">

                {project.requiredSkills?.map(
                  (skill, index) => (

                    <span key={index}>
                      {skill}
                    </span>

                  )
                )}

              </div>

            </section>


          </div>


          {/* RIGHT */}

          <aside>


            {/* PROGRESS */}

            <section className="details-card">

              <div className="details-card-heading">

                <h2>
                  Project Progress
                </h2>

                <strong>
                  {project.progress}%
                </strong>

              </div>


              <div className="details-progress">

                <div
                  style={{
                    width: `${project.progress}%`
                  }}
                />

              </div>

              <p>
                Current status: {project.status}
              </p>

            </section>


            {/* TEAM */}

            <section className="details-card">

              <h2>
                Team
              </h2>

              <div className="team-member">

                <div className="team-avatar">
                  👤
                </div>

                <div>

                  <strong>
                    Project Owner
                  </strong>

                  <span>
                    Team member
                  </span>

                </div>

              </div>

            </section>


            {/* ACTIONS */}

            <section className="details-card project-actions">

              <button
                className="edit-project-btn"
              >
                Edit Project
              </button>

              <button
                className="find-team-btn"
              >
                Find Teammates
              </button>

            </section>


          </aside>


        </div>

      </main>

    </div>

  )

}

export default ProjectDetails