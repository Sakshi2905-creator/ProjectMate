import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function ResetPassword() {

  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setMessage('')

    if (password !== confirmPassword) {

      setError('Passwords do not match')
      return

    }

    if (password.length < 6) {

      setError(
        'Password must be at least 6 characters'
      )

      return
    }

    setLoading(true)

    try {

      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setError(
          data.message ||
          'Unable to reset password'
        )

        return
      }

      setMessage(data.message)

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {

      setError(
        'Unable to connect to server'
      )

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
            🔐 SECURE ACCOUNT
          </p>

          <h1>
            Create a
            <br />
            <span>new password.</span>
          </h1>

          <p>
            Choose a strong password to keep
            your ProjectMate account secure.
          </p>

        </div>

      </div>


      <div className="auth-form-container">

        <div className="auth-card">

          <div className="auth-heading">

            <h2>
              Reset Password
            </h2>

            <p>
              Enter your new password below.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter new password"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
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
                ? 'Resetting...'
                : 'Reset Password →'}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default ResetPassword