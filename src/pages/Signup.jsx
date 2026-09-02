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
  const [showPassword, setShowPassword] = useState(false)

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

            <h2>Create your account</h2>

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

              <div className="password-input-wrapper">

  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
    aria-label={showPassword ? 'Hide password' : 'Show password'}
  >
    {showPassword ? (
      // Eye OFF
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L21 21"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M10.6 10.6A2 2 0 0 0 13.4 13.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M9.9 4.3C10.6 4.1 11.3 4 12 4C17.5 4 21 12 21 12C20.4 13.4 19.5 14.8 18.3 16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        <path
          d="M6.2 6.2C4.5 7.6 3.4 9.7 3 12C3 12 6.5 20 12 20C13.2 20 14.3 19.7 15.4 19.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      // Eye ON
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 12C3 12 6.5 5 12 5C17.5 5 21 12 21 12C21 12 17.5 19 12 19C6.5 19 3 12 3 12Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    )}
  </button>

</div>

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
    : 'Create my ProjectMate account'}
</button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <button className="google-btn">

  <svg
    className="google-icon"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
    />

    <path
      fill="#34A853"
      d="M12 21.99c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.99z"
    />

    <path
      fill="#FBBC05"
      d="M6.54 14.07A5.86 5.86 0 0 1 6.23 12c0-.72.12-1.42.31-2.07V7.4H3.3A10 10 0 0 0 2 12c0 1.66.4 3.23 1.1 4.6l3.44-2.53z"
    />

    <path
      fill="#EA4335"
      d="M12 5.88c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 2.98 14.63 2 12 2a9.74 9.74 0 0 0-8.7 5.4l3.44 2.53C7.31 7.6 9.46 5.88 12 5.88z"
    />
  </svg>

  <span>Continue with Google</span>

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