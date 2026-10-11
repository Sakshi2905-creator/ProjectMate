import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [previewMessage, setPreviewMessage] = useState('')

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

  const handleCopyIdea = async () => {
    const idea =
      'Campus Companion: A student-focused platform for campus resources, events and everyday activities. Tech stack: React, Node.js, MongoDB and AI/ML.'

    try {
      await navigator.clipboard.writeText(idea)
      setPreviewMessage('Project idea copied successfully!')
    } catch (error) {
      console.error('Copy project idea error:', error)
      setPreviewMessage(
        'Could not copy the idea. Please try again.'
      )
    } finally {
      setMenuOpen(false)
    }
  }

  const handleStartProject = () => {
    setMenuOpen(false)
    handleProtectedNavigation('/create-project')
  }

  return (
    <section className="hero" id="home">

      {/* HERO CONTENT */}
      <div className="hero-content">

        <p className="hero-tag">
          🚀 Built for student builders
        </p>

        <h1>
          Find the right people
          <br />
          for your <span>next project.</span>
        </h1>

        <p className="hero-description">
          Discover project ideas, connect with students
          who complement your skills, and turn your ideas
          into real projects with ProjectMate.
        </p>

        <div className="hero-buttons">

          <button
            className="primary-btn"
            onClick={() =>
              handleProtectedNavigation('/discover')
            }
          >
            Explore Projects →
          </button>

          <button
            className="secondary-btn"
            onClick={() =>
              handleProtectedNavigation('/create-project')
            }
          >
            + Start a Project
          </button>

        </div>

        <div className="hero-stats">

          <div>
            <h3>01</h3>
            <p>Discover ideas</p>
          </div>

          <div>
            <h3>02</h3>
            <p>Find teammates</p>
          </div>

          <div>
            <h3>03</h3>
            <p>Build together</p>
          </div>

        </div>

      </div>


      {/* PROJECT PREVIEW CARD */}
      <div className="hero-visual">

        <article className="project-card">

          <div className="card-header">

            <span className="project-status">
              <span className="status-dot" />
              PROJECT CONCEPT
            </span>

            <div className="project-preview-actions">

              <button
                type="button"
                className="project-menu-button"
                aria-label="Open project preview actions"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span aria-hidden="true">⋮</span>
              </button>

              {menuOpen && (
                <div className="project-preview-menu">

                  <button
                    type="button"
                    onClick={handleCopyIdea}
                  >
                    <span aria-hidden="true">📋</span>
                    Copy project idea
                  </button>

                  <button
                    type="button"
                    onClick={handleStartProject}
                  >
                    <span aria-hidden="true">✚</span>
                    Start a similar project
                  </button>

                </div>
              )}

            </div>

          </div>


          <div className="project-info">

            <span className="project-type">
              CAMPUS & PRODUCTIVITY
            </span>

            <h2>
              Campus Companion
            </h2>

            <p>
              A student-focused concept for organizing
              campus resources, events and everyday activities.
            </p>

          </div>


          <div className="skills" aria-label="Example technology stack">
            <span>React</span>
            <span>Node.js</span>
            <span>MongoDB</span>
            <span>AI/ML</span>
          </div>


          <div className="card-footer">

            <div className="team-preview">

              <div className="team-avatars" aria-hidden="true">
                <span className="avatar">S</span>
                <span className="avatar">A</span>
                <span className="avatar">R</span>
              </div>

              <div className="team-preview-info">
                <strong>Team preview</strong>
                <span>Illustrative collaborators</span>
              </div>

            </div>

            <span className="preview-badge">
              Example
            </span>

          </div>

          {previewMessage && (
            <p
              className="project-preview-feedback"
              role="status"
              aria-live="polite"
            >
              {previewMessage}
            </p>
          )}

        </article>

      </div>

    </section>
  )
}

export default Hero