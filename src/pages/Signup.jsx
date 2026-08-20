import { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interest: ''
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {

      const response = await fetch(
        'http://localhost:5000/api/auth/signup',
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
        setError(data.message || 'Signup failed')
        return
      }

      setMessage(data.message)

      setFormData({
        name: '',
        email: '',
        password: '',
        interest: ''
      })

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

          <p className="auth-tag">✨ YOUR PROJECT. YOUR TEAM. YOUR IDEA.</p>

          <h1>
            Don't just have
            <br />
            an idea. <span>Build it.</span>
          </h1>

          <p>
            Create your profile, showcase your skills
            and find the perfect teammates for your
            next big project.
          </p>

          <div className="auth-mini-card">

            <div className="mini-avatar">
              S
            </div>

            <div>
              <strong>Looking for a teammate?</strong>

              <p>
                ProjectMate can help you find one.
              </p>
            </div>

          </div>

        </div>

      </div>


      <div className="auth-form-container">

        <div className="auth-card">

          <div className="auth-heading">

            <h2>Create your account ✨</h2>

            <p>
              Join a community of student builders.
            </p>

          </div>


          <form onSubmit={handleSignup}>

            <div className="form-group">

              <label>Full Name</label>

              <input
  type="text"
  name="name"
  value={formData.name}
  onChange={handleChange}
  placeholder="Enter your full name"
/>

            </div>


            <div className="form-group">

              <label>Email Address</label>

              <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="you@example.com"
/>

            </div>


            <div className="form-group">

              <label>Password</label>

              <input
  type="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Create a strong password"
/>

            </div>


            <div className="form-group">

              <label>What do you want to do?</label>

              <select
  name="interest"
  value={formData.interest}
  onChange={handleChange}
>
                <option value="" disabled>
                  Select your interest
                </option>

                <option value="build">
                  Build a project
                </option>

                <option value="join">
                  Join a project
                </option>

                <option value="both">
                  Both
                </option>
              </select>

            </div>


{error && (
  <p className="form-error">
    {error}
  </p>
)}

{message && (
  <p className="form-success">
    {message}
  </p>
)}

            <button
  type="submit"
  className="auth-submit"
  disabled={loading}
>
  {loading
    ? 'Creating account...'
    : 'Create my ProjectMate account →'}
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

            Already have an account?

            <Link to="/login">
              {' '}Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default Signup