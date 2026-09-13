import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Teams.css'

function Teams() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [teams, setTeams] = useState([])
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

    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/teams/${loggedInUser.id}`
        )

        const data = await response.json()

        if (response.ok) {
          setTeams(data.projects || [])
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error('Error fetching teams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
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
    <div className="teams-page">

      {/* ================= NAVBAR ================= */}

      <nav className="teams-navbar">

        <div
          className="teams-brand"
          onClick={() => navigate('/dashboard')}
        >
          Project<span>Mate</span>
        </div>

        <div className="teams-nav-links">

          <button onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>

          <button onClick={() => navigate('/discover')}>
            Discover
          </button>

          <button onClick={() => navigate('/projects')}>
            My Projects
          </button>

          <button className="active">
            Teams
          </button>

        </div>

        <div className="teams-profile">

          <div className="teams-user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="teams-user-info">
            <strong>{user.name}</strong>
            <small>Builder</small>
          </div>

          <button
            className="teams-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="teams-container">

        {/* HEADER */}

        <section className="teams-header">

          <div>

            <p className="teams-label">
              COLLABORATION HUB
            </p>

            <h1>My Teams</h1>

            <p>
              View and manage the teams you are part of.
            </p>

          </div>

          <button
            className="find-teammates-btn"
            onClick={() => navigate('/discover')}
          >
            Find Teammates
          </button>

        </section>


        {/* ================= STATS ================= */}

        {!loading && teams.length > 0 && (

          <section className="teams-stats">

            <div className="team-stat-card">

              <div className="team-stat-icon">
                👥
              </div>

              <div>
                <strong>{teams.length}</strong>
                <span>Active Teams</span>
              </div>

            </div>


            <div className="team-stat-card">

              <div className="team-stat-icon">
                🧑‍🤝‍🧑
              </div>

              <div>

                <strong>
                  {new Set(
                    teams.flatMap(team =>
                      (team.members || []).map(
                        member => member._id
                      )
                    )
                  ).size}
                </strong>

                <span>Total Members</span>

              </div>

            </div>


            <div className="team-stat-card">

              <div className="team-stat-icon">
                🚀
              </div>

              <div>

                <strong>
                  {
                    teams.filter(
                      team => team.status === 'In Progress'
                    ).length
                  }
                </strong>

                <span>In Progress</span>

              </div>

            </div>

          </section>

        )}


        {/* ================= CONTENT ================= */}

        {loading ? (

          <div className="teams-loading">

            <div className="teams-spinner"></div>

            <p>Loading your teams...</p>

          </div>

        ) : teams.length === 0 ? (

          <div className="teams-empty">

            <div className="teams-empty-icon">
              👥
            </div>

            <h2>No teams yet</h2>

            <p>
              Join a project or invite teammates to start
              building together.
            </p>

            <button
              onClick={() => navigate('/discover')}
            >
              Discover Projects
            </button>

          </div>

        ) : (

          <section className="teams-grid">

            {teams.map((team) => (

              <article
                className="team-card"
                key={team._id}
              >

                {/* CARD HEADER */}

                <div className="team-card-header">

                  <div className="team-project-icon">
                    {team.title
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="team-title-area">

                    <h2>
                      {team.title}
                    </h2>

                    <span className="team-status">
                      {team.status || 'Planning'}
                    </span>

                  </div>

                </div>


                {/* DESCRIPTION */}

                <p className="team-description">
                  {team.description ||
                    'No project description available.'}
                </p>


                {/* PROJECT INFO */}

                <div className="team-info-row">

                  <span>
                    📁 {team.category || 'General'}
                  </span>

                  <span>
                    🎯 {team.difficulty || 'Intermediate'}
                  </span>

                </div>


                {/* MEMBERS */}

                <div className="team-members-section">

                  <div className="team-members-heading">

                    <strong>
                      Team Members
                    </strong>

                    <span>
                      {team.members?.length || 0}
                    </span>

                  </div>


                  <div className="team-members-list">

                    {(team.members || [])
                      .slice(0, 5)
                      .map((member) => (

                        <div
                          className="team-member"
                          key={member._id}
                        >

                          <div className="member-avatar">
                            {member.name
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="member-details">

                            <strong>
                              {member.name}
                            </strong>

                            <small>
                              {member._id === team.owner?._id
                                ? 'Project Owner'
                                : 'Team Member'}
                            </small>

                          </div>

                        </div>

                      ))}

                  </div>

                </div>


                {/* FOOTER */}

                <div className="team-card-footer">

                  <span>
                    {team.members?.length || 0} members
                  </span>

                  <button
                    onClick={() =>
                      navigate(`/project/${team._id}`)
                    }
                  >
                    View Team →
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

export default Teams