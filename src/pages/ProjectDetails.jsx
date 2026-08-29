import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ProjectDetails.css'

function ProjectDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [joinStatus, setJoinStatus] = useState('')
  const [joining, setJoining] = useState(false)

const [matchPercentage, setMatchPercentage] = useState(0)
const [matchedSkills, setMatchedSkills] = useState([])
const [missingSkills, setMissingSkills] = useState([])
const [matchLoading, setMatchLoading] = useState(true)

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

const handleJoinRequest = async () => {

  try {

    setJoining(true)
    setJoinStatus('')

    const user = JSON.parse(
      localStorage.getItem('user')
    )

    if (!user?.id) {
      setJoinStatus('Please login first')
      return
    }

    const response = await fetch(
      `http://localhost:5000/api/projects/${id}/join`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId: user.id
        })
      }
    )

    const data = await response.json()

    if (response.ok) {

      setJoinStatus(
        'Join request sent successfully! 🎉'
      )

    } else {

      setJoinStatus(
        data.message || 'Failed to send request'
      )

    }

  } catch (error) {

    console.error(
      'Join request error:',
      error
    )

    setJoinStatus(
      'Unable to connect to server'
    )

  } finally {

    setJoining(false)

  }

}

// ================= SMART MATCH =================

useEffect(() => {

  const fetchMatch = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem('user')
      )

      if (!user?.id) {
        setMatchLoading(false)
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/match/${user.id}`
      )

      const data = await response.json()

      if (!response.ok) {

        console.error(
          data.message || 'Failed to calculate match'
        )

        return
      }

      setMatchPercentage(
        data.matchPercentage || 0
      )

      setMatchedSkills(
        data.matchedSkills || []
      )

      setMissingSkills(
        data.missingSkills || []
      )

    } catch (error) {

      console.error(
        'Match calculation error:',
        error
      )

    } finally {

      setMatchLoading(false)

    }

  }

  fetchMatch()

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
{/* SMART MATCH */}

<section className="details-card smart-match-card">

  <div className="details-card-heading">

    <h2>
      Your Match
    </h2>

    {!matchLoading && (
      <strong>
        {matchPercentage}%
      </strong>
    )}

  </div>


  {matchLoading ? (

    <p>
      Calculating your match...
    </p>

  ) : (

    <>

      <div className="match-progress">

        <div
          style={{
            width: `${matchPercentage}%`
          }}
        />

      </div>


      <p className="match-summary">

        {matchPercentage >= 70
          ? 'Great match for this project! 🎯'
          : matchPercentage >= 40
          ? 'You match some of the required skills.'
          : 'This project may require some additional skills.'}

      </p>


      {matchedSkills.length > 0 && (

        <div className="match-skills">

          <span>
            MATCHED SKILLS
          </span>

          <div className="details-tags">

            {matchedSkills.map(
              (skill, index) => (

                <span key={index}>
                  ✓ {skill}
                </span>

              )
            )}

          </div>

        </div>

      )}


      {missingSkills.length > 0 && (

        <div className="match-skills">

          <span>
            SKILLS TO LEARN
          </span>

          <div className="details-tags">

            {missingSkills.map(
              (skill, index) => (

                <span key={index}>
                  {skill}
                </span>

              )
            )}

          </div>

        </div>

      )}

    </>

  )}

</section>

            {/* TEAM */}

           <section className="details-card">

  <h2>
    Team
  </h2>

  <div className="team-list">

    {project.members?.length > 0 ? (

      project.members.map((member, index) => (

        <div
          className="team-member"
          key={member._id || index}
        >

          <div className="team-avatar">
            {member.name
              ?.charAt(0)
              ?.toUpperCase() || 'U'}
          </div>

          <div>

            <strong>
              {member.name || 'Unknown User'}
            </strong>

            <span>
              {index === 0
                ? 'Project Owner'
                : 'Team Member'}
            </span>

          </div>

        </div>

      ))

    ) : (

      <p>
        No team members yet.
      </p>

    )}

  </div>

</section>

            {/* ACTIONS */}

            <section className="details-card project-actions">

              <button
  className="edit-project-btn"
  onClick={() =>
    navigate(`/edit-project/${id}`)
  }>
  Edit Project
</button>
              <button
  className="find-team-btn"
  onClick={() =>
    navigate(`/project/${id}/find-teammates`)
  }
>
  Find Teammates
</button>
              <button
  className="join-project-btn"
  onClick={handleJoinRequest}
  disabled={joining}
>
  {joining
    ? 'Sending...'
    : 'Request to Join →'}
</button>

{joinStatus && (
  <p className="join-status">
    {joinStatus}
  </p>
)}

            </section>


          </aside>


        </div>

      </main>

    </div>

  )

}

export default ProjectDetails