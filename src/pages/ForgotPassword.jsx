import { useState } from 'react'
import { Link } from 'react-router-dom'

function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setMessage('')
    setLoading(true)

    try {

      const response = await fetch(
        'http://localhost:5000/api/auth/forgot-password',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ email })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Something went wrong')
        return
      }

      setMessage(data.message)

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

          <p className="auth-tag">
            🔐 ACCOUNT RECOVERY
          </p>

          <h1>
            Get back to
            <br />
            <span>building.</span>
          </h1>

          <p>
            Enter your email address and we'll
            send you a secure password reset link.
          </p>

        </div>

      </div>


      <div className="auth-form-container">

        <div className="auth-card">

          <div className="auth-heading">

            <h2>
              Forgot Password?
            </h2>

            <p>
              Enter your registered email address
              to reset your password.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
              />

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
                ? 'Sending...'
                : 'Send Reset Link →'}
            </button>

          </form>


          <p className="auth-switch">

            Remember your password?

            <Link to="/login">
              {' '}Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}

export default ForgotPassword