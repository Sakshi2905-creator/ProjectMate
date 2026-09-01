import { useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()

  return (
    <nav className="navbar">

      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        Project<span>Mate</span>
      </div>


      <div className="nav-links">

        <a href="#projects">
          Projects
        </a>

        <a href="#how-it-works">
          How It Works
        </a>

        <a href="#about">
          About
        </a>

      </div>


      <div className="nav-buttons">

        {/* LOGIN */}

        <button
          className="login-btn"
          onClick={() => navigate('/login')}
        >
          Login
        </button>


        {/* GET STARTED */}

        <button
          className="signup-btn"
          onClick={() => navigate('/signup')}
        >
          Get Started
        </button>

      </div>

    </nav>
  )
}

export default Navbar