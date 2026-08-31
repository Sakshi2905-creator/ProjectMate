import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyInvitations.css'

function MyInvitations() {

  const navigate = useNavigate()

  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [processing, setProcessing] = useState(null)
const [message, setMessage] = useState('')

const handleInvitation = async (
  projectId,
  invitationId,
  action
) => {

  try {

    setProcessing(invitationId)
    setMessage('')

    const response = await fetch(
      `http://localhost:5000/api/projects/${projectId}/invitations/${invitationId}/${action}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {

      setMessage(
        data.message ||
        'Something went wrong'
      )

      return
    }

    setMessage(
      data.message
    )

    // Remove processed invitation
    setInvitations(prev =>
      prev.filter(
        invitation =>
          invitation.invitationId !==
          invitationId
      )
    )

  } catch (error) {

    console.error(error)

    setMessage(
      'Unable to connect to server'
    )

  } finally {

    setProcessing(null)

  }

}

  useEffect(() => {

    const fetchInvitations = async () => {

      try {

        const user =
          JSON.parse(localStorage.getItem('user'))

        if (!user?._id && !user?.id) {

          setError('Please login first')
          setLoading(false)
          return

        }

        const userId =
          user._id || user.id


        const response = await fetch(
          `http://localhost:5000/api/projects/invitations/${userId}`
        )

        const data = await response.json()


        if (!response.ok) {

          setError(
            data.message ||
            'Unable to fetch invitations'
          )

          return
        }


        setInvitations(
          data.invitations || []
        )

      } catch (error) {

        console.error(error)

        setError(
          'Unable to connect to server'
        )

      } finally {

        setLoading(false)

      }

    }


    fetchInvitations()

  }, [])


  if (loading) {

    return (
      <div className="invitations-page">

        <div className="invitations-loading">
          Loading your invitations...
        </div>

      </div>
    )

  }


  if (error) {

    return (
      <div className="invitations-page">

        <div className="invitations-error">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate('/dashboard')
            }
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>
    )

  }


  return (

    <div className="invitations-page">

      <header className="invitations-header">

        <button
          className="invitations-back-btn"
          onClick={() =>
            navigate('/dashboard')
          }
        >
          ← Dashboard
        </button>

        <span className="invitations-label">
          TEAM INVITATIONS
        </span>

        <h1>
          My Invitations
        </h1>

        <p>
          Projects that want you to join their team.
        </p>

      </header>


      <main className="invitations-container">
        {message && (
  <div className="invitation-message">
    {message}
  </div>
)}

        {invitations.length === 0 ? (

          <div className="no-invitations">

            <div className="no-invitations-icon">
              ✉️
            </div>

            <h2>
              No invitations yet
            </h2>

            <p>
              When someone invites you to their
              project, it will appear here.
            </p>

          </div>

        ) : (

          <div className="invitations-list">

            {invitations.map(invitation => (

              <article
                className="invitation-card"
                key={invitation.invitationId}
              >

                <div className="invitation-card-top">

                  <div>

                    <span className="project-label">
                      PROJECT INVITATION
                    </span>

                    <h2>
                      {invitation.projectTitle}
                    </h2>

                  </div>

                  <span className="pending-badge">
                    Pending
                  </span>

                </div>


                <p className="invitation-description">

                  {invitation.projectdescription}

                </p>


                <div className="invitation-details">

                  <div>

                    <span>
                      CATEGORY
                    </span>

                    <strong>
                      {invitation.category}
                    </strong>

                  </div>


                  <div>

                    <span>
                      DIFFICULTY
                    </span>

                    <strong>
                      {invitation.difficulty}
                    </strong>

                  </div>


                  <div>

                    <span>
                      TEAM SIZE
                    </span>

                    <strong>
                      {invitation.teamSize}
                    </strong>

                  </div>

                </div>


                <div className="invitation-owner">

                  <span>
                    INVITED BY
                  </span>

                  <strong>
                    {invitation.owner?.name}
                  </strong>

                  <small>
                    {invitation.owner?.email}
                  </small>

                </div>


                <div className="invitation-skills">

                  <span>
                    REQUIRED SKILLS
                  </span>

                  <div>

                    {invitation.requiredSkills?.map(
                      (skill, index) => (

                        <span
                          key={index}
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </div>


                <div className="invitation-actions">

  <button
    className="reject-invitation-btn"
    onClick={() =>
      handleInvitation(
        invitation.projectId,
        invitation.invitationId,
        'reject'
      )
    }
    disabled={
      processing === invitation.invitationId
    }
  >
    {processing === invitation.invitationId
      ? 'Processing...'
      : 'Reject'}
  </button>


  <button
    className="accept-invitation-btn"
    onClick={() =>
      handleInvitation(
        invitation.projectId,
        invitation.invitationId,
        'accept'
      )
    }
    disabled={
      processing === invitation.invitationId
    }
  >
    {processing === invitation.invitationId
      ? 'Processing...'
      : 'Accept Invitation'}
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

export default MyInvitations