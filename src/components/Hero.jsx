import { useNavigate } from 'react-router-dom'

function Hero() {

  const navigate = useNavigate()


  // Check whether user is logged in
  const handleProtectedNavigation = (path) => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    navigate(path)
  }


  return (

    <section className="hero">

      <div className="hero-content">

        <p className="hero-tag">
          🚀 Build. Collaborate. Create.
        </p>


        <h1>
          Find the right people
          <br />
          for your <span>next project.</span>
        </h1>


        <p className="hero-description">
          ProjectMate helps students discover project ideas,
          find teammates with the right skills, and build
          amazing projects together.
        </p>


        {/* ================= HERO BUTTONS ================= */}

        <div className="hero-buttons">

          {/* EXPLORE PROJECTS */}

          <button
            className="primary-btn"
            onClick={() =>
              handleProtectedNavigation('/discover')
            }
          >
            Explore Projects
          </button>


          {/* CREATE PROJECT */}

          <button
            className="secondary-btn"
            onClick={() =>
              handleProtectedNavigation('/create-project')
            }
          >
            Create a Project
          </button>

        </div>


        {/* ================= STATS ================= */}

        <div className="hero-stats">

          <div>
            <h3>500+</h3>
            <p>Projects</p>
          </div>

          <div>
            <h3>1,200+</h3>
            <p>Students</p>
          </div>

          <div>
            <h3>50+</h3>
            <p>Skills</p>
          </div>

        </div>

      </div>


      {/* ================= HERO VISUAL ================= */}

     <div className="hero-visual">

  <div className="project-card">

    {/* CARD HEADER */}
    <div className="card-header">

      <span className="project-status">
        <span className="status-dot"></span>
        Open for teammates
      </span>

      <span className="project-menu">
        ⋮
      </span>

    </div>


    {/* PROJECT INFO */}
    <div className="project-info">

      <h2>
        Smart Campus Assistant
      </h2>

      <p>
        An AI-powered platform that helps students
        manage their academic life.
      </p>

    </div>


    {/* SKILLS */}
    <div className="skills">

      <span>React</span>
      <span>Node.js</span>
      <span>MongoDB</span>
      <span>AI/ML</span>

    </div>


    {/* CARD FOOTER */}
    <div className="card-footer">

      <div className="team">

        <div className="avatar">S</div>
        <div className="avatar">A</div>
        <div className="avatar">R</div>

        <span className="team-count">
          +2
        </span>

      </div>

            <button
              className="join-btn"
              onClick={() =>
                handleProtectedNavigation('/discover')
              }
            >
              Join Project
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero