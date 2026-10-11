import { useNavigate } from 'react-router-dom'

function CTA() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    if (!token) {
      navigate('/signup')
      return
    }

    navigate('/create-project')
  }

  return (
    <section className="cta">

      <p className="cta-eyebrow">
        YOUR NEXT PROJECT STARTS HERE
      </p>

      <h2>
        Bring your next idea to life.
        <br />
        <span>Find your people.</span>
      </h2>

      <p>
        Whether you have a clear project plan or just
        the beginning of an idea, take the next step.
        Find collaborators and start building together.
      </p>

      <button
        className="primary-btn"
        onClick={handleGetStarted}
      >
        Get Started with ProjectMate →
      </button>

    </section>
  )
}

export default CTA