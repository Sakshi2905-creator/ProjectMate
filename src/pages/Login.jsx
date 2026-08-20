import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

  function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(formData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      // Save JWT token
      localStorage.setItem('token', data.token)

      // Save user information
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      // Go to dashboard
      navigate('/dashboard')

    } catch (error) {

      setError('Unable to connect to server')

    } finally {

      setLoading(false)

    }
  }

  return (
    <div className="auth-page">

      <div className="auth-brand">

        <Link to="/" className="auth-logo">
          Project<span>Mate</span>
        </Link>

        <div className="auth-brand-content">
          <p className="auth-tag">🚀 BUILD • COLLABORATE • CREATE</p>

          <h1>
            Turn your ideas
            <br />
            into <span>real projects.</span>
          </h1>

          <p>
            Connect with students who have the skills,
            ideas and passion to build something amazing
            together.
          </p>

          <div className="auth-features">
            <div>
              <span>✓</span>
              Find teammates with the right skills
            </div>

            <div>
              <span>✓</span>
              Discover exciting project ideas
            </div>

            <div>
              <span>✓</span>
              Collaborate and build together
            </div>
          </div>
        </div>

      </div>


      <div className="auth-form-container">

        <div className="auth-card">

          <div className="auth-heading">
            <h2>Welcome back 👋</h2>

            <p>
              Login to continue building amazing projects.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="form-group">
              <label>Email Address</label>

              <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
/>
            </div>


            <div className="form-group">
              <div className="label-row">
                <label>Password</label>

                <a href="#forgot">
                  Forgot password?
                </a>
              </div>

              <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
/>
            </div>

{error && (
  <p className="form-error">
    {error}
  </p>
)}
           <button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading ? 'Signing in...' : 'Login →'}
</button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <button className="google-btn">
            <span>G</span>
            Continue with Google
          </button>


          <p className="auth-switch">
            Don't have an account?
            <Link to="/signup"> Create one</Link>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login