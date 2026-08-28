import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './JoinRequests.css'

function JoinRequests() {

  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

const handleRequest = async (
    projectId,
    requestId,
    action
  ) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/join/${requestId}/${action}`,
        {
          method: 'POST'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setMessage(
          data.message || 'Something went wrong'
        )
        return
      }

      setMessage(data.message)

      // Remove processed request from UI
      setRequests(prevRequests =>
        prevRequests.filter(
          request => request._id !== requestId
        )
      )

    } catch (error) {

      console.error(
        'Request action error:',
        error
      )

      setMessage(
        'Unable to process request'
      )

    }

  }



  useEffect(() => {

    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      navigate('/login')
      return
    }

    const user = JSON.parse(storedUser)


    const fetchRequests = async () => {

      try {

        // Fetch projects owned by current user

        const projectResponse = await fetch(
          `http://localhost:5000/api/projects/user/${user.id}`
        )

        const projectData =
          await projectResponse.json()


        if (!projectResponse.ok) {
          setMessage('Unable to load your projects')
          return
        }


        const userProjects =
          projectData.projects || []

        setProjects(userProjects)


        // Fetch requests for every project

        let allRequests = []

        for (const project of userProjects) {

          const response = await fetch(
            `http://localhost:5000/api/projects/${project._id}/join-requests`
          )

          const data = await response.json()

          if (response.ok) {

            const projectRequests =
              (data.requests || []).map(request => ({
                ...request,
                projectTitle: project.title,
                projectId: project._id
              }))

            allRequests = [
              ...allRequests,
              ...projectRequests
            ]

          }

        }


        setRequests(allRequests)

      } catch (error) {

        console.error(
          'Error fetching join requests:',
          error
        )

        setMessage(
          'Unable to load join requests'
        )

      } finally {

        setLoading(false)

      }

    }


    fetchRequests()

  }, [navigate])


  if (loading) {

    return (
      <div className="join-requests-page">

        <div className="join-loading">
          Loading join requests...
        </div>

      </div>
    )

  }


  return (

    <div className="join-requests-page">


      {/* HEADER */}

      <header className="join-requests-header">

        <button
          className="join-back-btn"
          onClick={() => navigate('/dashboard')}
        >
          ← Dashboard
        </button>


        <div>

          <span className="join-label">
            TEAM MANAGEMENT
          </span>

          <h1>
            Join Requests
          </h1>

          <p>
            Review students who want to join
            your projects.
          </p>

        </div>

      </header>


      {/* CONTENT */}

      <main className="join-requests-container">

        {message && (
          <div className="join-message">
            {message}
          </div>
        )}


        {requests.length === 0 ? (

          <div className="empty-requests">

            <div className="empty-icon">
              👥
            </div>

            <h2>
              No pending requests
            </h2>

            <p>
              When someone requests to join
              your project, their request will
              appear here.
            </p>

            <button
              onClick={() => navigate('/discover')}
            >
              Explore Projects
            </button>

          </div>

        ) : (

          <div className="requests-list">

            {requests.map(request => (

              <article
                className="request-card"
                key={request._id}
              >

                <div className="request-user">

                  <div className="request-avatar">

                    {request.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || 'U'}

                  </div>


                  <div>

                    <h2>
                      {request.user?.name ||
                        'Unknown User'}
                    </h2>

                    <p>
                      {request.user?.email}
                    </p>

                  </div>

                </div>


                <div className="request-project">

                  <span>
                    PROJECT
                  </span>

                  <strong>
                    {request.projectTitle}
                  </strong>

                </div>


                <div className="request-skills">

                  <span className="request-section-title">
                    SKILLS
                  </span>


                  <div className="request-tags">

                    {request.user?.skills?.length ? (

                      request.user.skills.map(
                        (skill, index) => (

                          <span key={index}>
                            {skill}
                          </span>

                        )
                      )

                    ) : (

                      <span>
                        No skills added
                      </span>

                    )}

                  </div>

                </div>


                <div className="request-actions">

  <button
    className="reject-btn"
    onClick={() =>
      handleRequest(
        request.projectId,
        request._id,
        'reject'
      )
    }
  >
    Reject
  </button>

  <button
    className="accept-btn"
    onClick={() =>
      handleRequest(
        request.projectId,
        request._id,
        'accept'
      )
    }
  >
    Accept
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

export default JoinRequests