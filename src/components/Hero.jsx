function Hero() {
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

        <div className="hero-buttons">
          <button className="primary-btn">
            Explore Projects →
          </button>

          <button className="secondary-btn">
            Create a Project
          </button>
        </div>

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


      <div className="hero-visual">

        <div className="project-card">

          <div className="card-header">

            <span className="project-status">
              ● Open for teammates
            </span>

            <span className="project-menu">
              ⋮
            </span>

          </div>

          <h2>Smart Campus Assistant</h2>

          <p>
            An AI-powered platform that helps students
            manage their academic life.
          </p>

          <div className="skills">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>AI/ML</span>
          </div>

          <div className="card-footer">

            <div className="team">
              <div className="avatar">S</div>
              <div className="avatar">A</div>
              <div className="avatar">R</div>

              <span>+2</span>
            </div>

            <button className="join-btn">
              Join Project
            </button>

          </div>

        </div>

      </div>

    </section>
  )
}

export default Hero