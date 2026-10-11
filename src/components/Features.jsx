import { useNavigate } from 'react-router-dom'

function Features() {
  const navigate = useNavigate()

  const handleProtectedNavigation = (path) => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    navigate(path)
  }

  return (
    <>
      {/* WHY PROJECTMATE */}
      <section className="features" id="about">

        <div className="section-heading">

          <p>WHY PROJECTMATE?</p>

          <h2>
            Good ideas grow faster
            <br />
            with the <span>right team.</span>
          </h2>

          <p>
            ProjectMate brings project discovery and
            skill-based collaboration into one place,
            helping students move from an idea to a working build.
          </p>

        </div>

        <div className="feature-grid">

          <article className="feature-card">

            <div className="feature-icon">🎯</div>

            <h3>Find your people</h3>

            <p>
              Discover students whose skills and interests
              align with your project. Find potential teammates
              instead of trying to build everything alone.
            </p>

          </article>

          <article className="feature-card">

            <div className="feature-icon">🧩</div>

            <h3>Start with clarity</h3>

            <p>
              Define your idea, tech stack, required skills,
              team size and deadline so potential collaborators
              know what they are joining.
            </p>

          </article>

          <article className="feature-card">

            <div className="feature-icon">📈</div>

            <h3>Make progress visible</h3>

            <p>
              Keep project status, completion progress and
              team information organized as you move from
              planning towards completion.
            </p>

          </article>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        className="home-how"
        id="how-it-works"
      >

        <div className="home-section-heading">

          <span className="home-eyebrow">
            SIMPLE TO START
          </span>

          <h2>
            From idea to team
            <br />
            in three steps.
          </h2>

          <p>
            You bring the idea. ProjectMate helps you
            find a starting point and the people to build with.
          </p>

        </div>

        <div className="home-steps-grid">

          <article className="home-step-card">

            <span className="home-step-number">01</span>

            <h3>Set up your profile</h3>

            <p>
              Add your technical skills, interests and
              what you would like to build or contribute.
            </p>

          </article>

          <article className="home-step-card">

            <span className="home-step-number">02</span>

            <h3>Create or discover</h3>

            <p>
              Publish your project requirements or explore
              existing projects that interest you.
            </p>

          </article>

          <article className="home-step-card">

            <span className="home-step-number">03</span>

            <h3>Connect and build</h3>

            <p>
              Invite potential teammates, request to join
              projects and keep track of your progress.
            </p>

          </article>

        </div>

        {/* <div className="home-center-action">

          <button
            className="primary-btn"
            onClick={() =>
              handleProtectedNavigation('/discover')
            }
          >
            Find Your Next Project →
          </button>

        </div> */}

      </section>


      {/* PROJECT AREAS */}
      <section
        className="home-project-areas"
        id="projects"
      >

        <div className="home-section-heading">

          <span className="home-eyebrow">
            MAKE SOMETHING REAL
          </span>

          <h2>
            What will you
            <br />
            <span>build next?</span>
          </h2>

          <p>
            Explore different directions for your next
            college project, experiment or portfolio piece.
          </p>

        </div>

        <div className="home-area-grid">

          <article className="home-area-card">
            <div className="home-area-icon">💻</div>
            <div>
              <h3>Web & Software</h3>
              <p>
                Build websites, full-stack applications
                and useful developer tools.
              </p>
            </div>
          </article>

          <article className="home-area-card">
            <div className="home-area-icon">🤖</div>
            <div>
              <h3>AI & Machine Learning</h3>
              <p>
                Explore intelligent applications,
                prediction systems and automation ideas.
              </p>
            </div>
          </article>

          <article className="home-area-card">
            <div className="home-area-icon">📱</div>
            <div>
              <h3>Mobile Applications</h3>
              <p>
                Create useful experiences for everyday
                student and community needs.
              </p>
            </div>
          </article>

          <article className="home-area-card">
            <div className="home-area-icon">📊</div>
            <div>
              <h3>Data & Analytics</h3>
              <p>
                Turn datasets into meaningful insights,
                visualizations and practical solutions.
              </p>
            </div>
          </article>

          <article className="home-area-card">
            <div className="home-area-icon">☁️</div>
            <div>
              <h3>Cloud & DevOps</h3>
              <p>
                Experiment with deployments, cloud
                infrastructure and developer workflows.
              </p>
            </div>
          </article>

          <article className="home-area-card">
            <div className="home-area-icon">🌱</div>
            <div>
              <h3>Campus & Community</h3>
              <p>
                Solve real problems around student life,
                accessibility and campus collaboration.
              </p>
            </div>
          </article>

        </div>

        <div className="home-center-action">

          <button
            className="primary-btn"
            onClick={() =>
              handleProtectedNavigation('/discover')
            }
          >
            Explore Projects →
          </button>

        </div>

      </section>


      {/* FAQ */}
      <section className="home-faq">

        <div className="home-section-heading">

          <span className="home-eyebrow">
            GOT QUESTIONS?
          </span>

          <h2>
            A few things to know.
          </h2>

          <p>
            Here's how you can get started with ProjectMate.
          </p>

        </div>

        <div className="home-faq-list">

          <details>
            <summary>
              Is ProjectMate suitable for beginners?
            </summary>

            <p>
              Yes. Projects can have different difficulty
              levels, and you can look for projects that
              suit your current skills and learning goals.
            </p>
          </details>

          <details>
            <summary>
              Can I create a project and join another one?
            </summary>

            <p>
              Yes. You can create your own project or explore
              existing projects and send a request to join.
            </p>
          </details>

          <details>
            <summary>
              How can I find suitable teammates?
            </summary>

            <p>
              Add your skills to your profile and explore
              the skill-match suggestions available in ProjectMate.
            </p>
          </details>

          <details>
            <summary>
              What should I include when creating a project?
            </summary>

            <p>
              Start with a clear description, technology stack,
              required skills, preferred team size and deadline.
              These details help potential teammates understand
              the project before joining.
            </p>
          </details>

        </div>

      </section>

    </>
  )
}

export default Features