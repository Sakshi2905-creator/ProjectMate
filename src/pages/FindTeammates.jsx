import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './FindTeammates.css'

function FindTeammates() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [teammates, setTeammates] = useState([])
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [inviting, setInviting] = useState(null)
const [inviteMessage, setInviteMessage] = useState('')

const handleInvite = async (userId) => {

  try {

    setInviting(userId)
    setInviteMessage('')

    const response = await fetch(
      `http://localhost:5000/api/projects/${id}/invite`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          userId
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {

      setInviteMessage(
        data.message || 'Failed to send invitation'
      )

      return
    }

    setInviteMessage(
      data.message || 'Invitation sent successfully! 🎉'
    )

  } catch (error) {

    console.error(
      'Invite error:',
      error
    )

    setInviteMessage(
      'Unable to connect to server'
    )

  } finally {

    setInviting(null)

  }

}

  useEffect(() => {

    const fetchTeammates = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}/find-teammates`
        )

        const data = await response.json()

        if (!response.ok) {

          setError(
            data.message || 'Unable to find teammates'
          )

          return
        }

        setProject(data.project)
        setTeammates(data.teammates || [])

      } catch (error) {

        console.error(error)

        setError(
          'Unable to connect to server'
        )

      } finally {

        setLoading(false)

      }

    }

    fetchTeammates()

  }, [id])


  if (loading) {

    return (
      <div className="find-teammates-page">

        <div className="find-loading">
          Finding the best teammates...
        </div>

      </div>
    )

  }


  if (error) {

    return (
      <div className="find-teammates-page">

        <div className="find-error">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate(`/project/${id}`)
            }
          >
            ← Back to Project
          </button>

        </div>

      </div>
    )

  }


  return (

    <div className="find-teammates-page">

      <header className="find-teammates-header">

        <button
          className="find-back-btn"
          onClick={() =>
            navigate(`/project/${id}`)
          }
        >
          ← Project Details
        </button>

        <span className="find-label">
          SMART TEAM BUILDER
        </span>

        <h1>
          Find Teammates
        </h1>

        <p>
          Discover students whose skills match
          your project requirements.
        </p>

      </header>


      <main className="find-teammates-container">

        {project && (

          <section className="find-project-info">

            <span>
              PROJECT
            </span>

            <h2>
              {project.title}
            </h2>

            <p>
              Required skills:{' '}
              {project.requiredSkills?.join(', ')}
            </p>

          </section>
          

        )}
        {inviteMessage && (
  <div className="invite-message">
    {inviteMessage}
  </div>
)}


        {teammates.length === 0 ? (

          <div className="no-teammates">

            <div>
              👥
            </div>

            <h2>
              No matching teammates yet
            </h2>

            <p>
              Try adding more skills to your
              project or check again later.
            </p>

          </div>

        ) : (

          <div className="teammates-list">

            {teammates.map(teammate => (

              <article
                className="teammate-card"
                key={teammate._id}
              >

                <div className="teammate-avatar">

                  {teammate.name
                    ?.charAt(0)
                    ?.toUpperCase() || 'U'}

                </div>


                <div className="teammate-info">

                  <h2>
                    {teammate.name}
                  </h2>

                  <p>
                    {teammate.email}
                  </p>

                </div>


                <div className="teammate-match">

                  <strong>
                    {teammate.matchPercentage}%
                  </strong>

                  <span>
                    Skill Match
                  </span>

                </div>


                <div className="teammate-skills">

                  {teammate.matchedSkills?.map(
                    (skill, index) => (

                      <span key={index}>
                        ✓ {skill}
                      </span>

                    )
                  )}

                </div>


               <button
  className="invite-btn"
  onClick={() => handleInvite(teammate._id)}
  disabled={inviting === teammate._id}
>
  {inviting === teammate._id
    ? 'Sending...'
    : 'Invite'}
</button>
              </article>

            ))}

          </div>

        )}

      </main>

    </div>

  )

}

export default FindTeammates