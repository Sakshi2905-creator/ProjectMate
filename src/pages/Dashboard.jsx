import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [invitationCount, setInvitationCount] = useState(0)

useEffect(() => {

  const token = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!token || !storedUser) {
    navigate('/login')
    return
  }

  const loggedInUser = JSON.parse(storedUser)

  setUser(loggedInUser)


  // Fetch user's projects

  const fetchProjects = async () => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/projects/user/${loggedInUser.id}`
      )

      const data = await response.json()

      if (response.ok) {

        setProjects(data.projects)

      } else {

        console.error(data.message)

      }

    } catch (error) {

      console.error(
        'Error fetching projects:',
        error
      )

    } finally {

      setLoadingProjects(false)

    }

  }

const fetchInvitationCount = async () => {

  try {

    const response = await fetch(
      `http://localhost:5000/api/projects/invitations/${loggedInUser.id}`
    )

    const data = await response.json()

    if (response.ok) {

      setInvitationCount(
        data.invitations?.length || 0
      )

    }

  } catch (error) {

    console.error(
      'Error fetching invitations:',
      error
    )

  }

}

fetchInvitationCount()

  fetchProjects()

}, [navigate])


  const handleLogout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login')

  }

  const totalProjects = projects.length

const totalTeamMembers = [
  ...new Set(
    projects.flatMap(project => project.members || [])
  )
].length

const activeProjects = projects.filter(
  project => project.status !== 'Completed'
).length

const upcomingProjects = projects
  .filter(project => project.deadline)
  .filter(project => new Date(project.deadline) >= new Date())
  .sort(
    (a, b) =>
      new Date(a.deadline) - new Date(b.deadline)
  )
  .slice(0, 3)

  if (!user) {
    return null
  }


  return (

    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <nav className="dashboard-navbar">

        <div className="dashboard-brand">
          Project<span>Mate</span>
        </div>


        <div className="dashboard-nav-links">

          <button className="active">
            Dashboard
          </button>

          <button onClick={() => navigate('/discover')}>
            Discover
          </button>

          <button onClick={() => navigate('/projects')}>
            My Projects
          </button>

          <button onClick={() => navigate('/teams')}>
            Teams
          </button>
      

        </div>


        <div className="dashboard-profile">

     <div
  className="notification"
  onClick={() => navigate('/invitations')}
>
  🔔

 {invitationCount > 0 && (
  <span className="notification-badge">
    {invitationCount > 99
      ? '99+'
      : invitationCount}
  </span>
)}
</div>

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

      <main className="dashboard-container">


        {/* HERO */}

        <section className="dashboard-hero">

          <div>

            <p className="hero-label">
              YOUR WORKSPACE
            </p>

            <h1>
              Good morning,{' '}
              {user.name.split(' ')[0]} 👋
            </h1>

            <p>
              Ready to turn your next idea into
              something real?
            </p>

          </div>


          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={() => navigate('/create-project')}
            >
              + Create Project
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate('/discover')}
            >
              Find Teammates
            </button>

          </div>

        </section>


        {/* ================= STATS ================= */}

        <section className="stats-grid">


          <div className="stat-card">

            <div className="stat-icon purple">
              🚀
            </div>
 <div>
    <span>My Projects</span>

    <strong>
      {totalProjects}
    </strong>

    <small>
      Your projects
    </small>
  </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon blue">
              👥
            </div>

            <div>
              <span>Team Members</span>
             <strong>
  {totalTeamMembers}
</strong>

<small>
  Across {totalProjects} projects
</small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              ✨
            </div>

            <div>
              <span>Best Match</span>
              <strong>94%</strong>
              <small>Skill compatibility</small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              🎯
            </div>

            <div>
              <span>Skills</span>
              <strong>7</strong>
              <small>Profile strength: 82%</small>
            </div>

          </div>

        </section>


        {/* ================= CONTENT GRID ================= */}

        <div className="dashboard-content">


          {/* ACTIVE PROJECTS */}

          <section className="dashboard-section projects-section">

            <div className="section-header">

              <div>
                <span className="section-label">
                  WORKSPACE
                </span>

                <h2>
                  Active Projects
                </h2>
              </div>

              <button
                onClick={() => navigate('/projects')}
              >
                View all →
              </button>

            </div>


           {/* REAL PROJECTS FROM MONGODB */}

{loadingProjects ? (

  <div className="project-loading">
    Loading your projects...
  </div>

) : projects.length === 0 ? (

  <div className="project-empty">

    <div className="empty-icon">
      🚀
    </div>

    <h3>
      No projects yet
    </h3>

    <p>
      Start building something amazing by creating
      your first project.
    </p>

    <button
      className="primary-btn"
      onClick={() => navigate('/create-project')}
    >
      + Create Your First Project
    </button>

  </div>

) : (

  projects.map((project) => (

    <div
  className="project-card"
  key={project._id}
  onClick={() =>
    navigate(`/project/${project._id}`)
  }
>

      {/* PROJECT INFORMATION */}

      <div className="project-main">

        <div className="project-logo">
          {project.title
            .substring(0, 2)
            .toUpperCase()}
        </div>


        <div>

          <h3>
            {project.title}
          </h3>

          <p>
            {project.description}
          </p>


          {/* TECH STACK */}

          <div className="tech-stack">

            {project.techStack.map((tech, index) => (

              <span key={index}>
                {tech}
              </span>

            ))}

          </div>

        </div>

      </div>


      {/* PROJECT PROGRESS */}

      <div className="project-progress">

        <div className="progress-info">

          <span>
            Progress
          </span>

          <strong>
            {project.progress}%
          </strong>

        </div>


        <div className="progress-bar">

          <div
            style={{
              width: `${project.progress}%`
            }}
          />

        </div>


        <small>

          {project.members?.length || 0}
          {' '}members • {' '}

          {project.status}

        </small>

      </div>

    </div>

  ))

)}

          </section>


          {/* RIGHT SIDE */}

          <aside className="dashboard-sidebar">


            {/* SMART MATCH */}

            <section className="side-section">

              <div className="section-header">

                <div>

                  <span className="section-label">
                    AI-POWERED
                  </span>

                  <h2>
                    Smart Matches
                  </h2>

                </div>

              </div>


              <div className="match-card">

                <div className="match-top">

                  <div className="match-avatar">
                    R
                  </div>

                  <div>

                    <strong>
                      Rahul Sharma
                    </strong>

                    <small>
                      Full Stack Developer
                    </small>

                  </div>

                  <span className="match-score">
                    94%
                  </span>

                </div>


                <div className="match-skills">

                  <span>React</span>
                  <span>Node.js</span>
                  <span>MongoDB</span>

                </div>


                <button>
                  View Profile →
                </button>

              </div>


              <div className="match-card">

                <div className="match-top">

                  <div className="match-avatar pink">
                    A
                  </div>

                  <div>

                    <strong>
                      Ananya Verma
                    </strong>

                    <small>
                      UI/UX Designer
                    </small>

                  </div>

                  <span className="match-score">
                    88%
                  </span>

                </div>


                <div className="match-skills">

                  <span>Figma</span>
                  <span>UI/UX</span>
                  <span>Research</span>

                </div>


                <button>
                  View Profile →
                </button>

              </div>

            </section>


            {/* ACTIVITY */}

            <section className="side-section activity-section">

              <div className="section-header">

                <div>

                  <span className="section-label">
                    RECENT
                  </span>

                  <h2>
                    Activity
                  </h2>

                </div>

              </div>


              <div className="activity-item">

                <div className="activity-dot purple-dot" />

                <div>

                  <strong>
                    Rahul joined your project
                  </strong>

                  <small>
                    12 minutes ago
                  </small>

                </div>

              </div>


              <div className="activity-item">

                <div className="activity-dot blue-dot" />

                <div>

                  <strong>
                    New teammate request
                  </strong>

                  <small>
                    1 hour ago
                  </small>

                </div>

              </div>


              <div className="activity-item">

                <div className="activity-dot green-dot" />

                <div>

                  <strong>
                    Project reached 70%
                  </strong>

                  <small>
                    Yesterday
                  </small>

                </div>

              </div>

            </section>
            
            {/* ================= JOIN REQUESTS ================= */}

<section className="side-section join-requests-section">

  <div className="section-header">

    <div>
      <span className="section-label">
        TEAM
      </span>

      <h2>
        Join Requests
      </h2>
    </div>

  </div>


  {projects.filter(
    project =>
      project.owner === user.id ||
      project.owner?._id === user.id
  ).length === 0 ? (

    <div className="no-requests">
      <p>No project requests yet.</p>
    </div>

  ) : (

    <div className="request-placeholder">

      <p>
        You have projects with potential
        join requests.
      </p>

      <button
        onClick={() => navigate('/join-requests')}
      >
        View Requests →
      </button>

    </div>

  )}

</section>

            {/* PROFILE STRENGTH */}

            <section className="profile-strength">

              <div>

                <span>
                  PROFILE STRENGTH
                </span>

                <strong>
                  82%
                </strong>

              </div>

              <div className="strength-bar">

                <div
                  style={{ width: '82%' }}
                />

              </div>

              <p>
                Add 2 more skills to improve
                your teammate matches.
              </p>

              <button
  onClick={() => navigate('/profile')}
>
  Complete Profile →
</button>
            </section>

          </aside>

        </div>


        {/* ================= UPCOMING ================= */}

       {/* ================= UPCOMING ================= */}

<section className="upcoming-section">

  <div className="section-header">

    <div>

      <span className="section-label">
        YOUR SCHEDULE
      </span>

      <h2>
        Upcoming
      </h2>

    </div>

    <button
      onClick={() => navigate('/calendar')}
    >
      View calendar 
    </button>

  </div>


  {upcomingProjects.length === 0 ? (

    <div className="upcoming-empty">

      <div className="upcoming-empty-icon">
        📅
      </div>

      <div>

        <strong>
          No upcoming deadlines
        </strong>

        <p>
          Your upcoming project deadlines
          will appear here.
        </p>

      </div>

    </div>

  ) : (

    <div className="upcoming-grid">

      {upcomingProjects.map(project => {

        const date = new Date(project.deadline)

        const day = date
          .getDate()
          .toString()
          .padStart(2, '0')

        const month = date
          .toLocaleString('en-US', {
            month: 'short'
          })
          .toUpperCase()

        return (

          <div
            className="upcoming-card"
            key={project._id}
            onClick={() =>
              navigate(`/project/${project._id}`)
            }
          >

            <div className="date-box">

              <strong>
                {day}
              </strong>

              <span>
                {month}
              </span>

            </div>


            <div className="upcoming-info">

              <strong>
                {project.title}
              </strong>

              <p>
                Project Deadline
              </p>

            </div>


            <span className="upcoming-arrow">
              →
            </span>

          </div>

        )

      })}

    </div>

  )}

</section>

      </main>

    </div>
  )
}

export default Dashboard