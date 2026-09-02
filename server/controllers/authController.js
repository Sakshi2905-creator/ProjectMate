const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const User = require('../models/User')

const signup = async (req, res) => {
  try {
    const { name, email, password, interest } = req.body

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Please fill all required fields'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({
        message: 'User with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      interest
    })

    res.status(201).json({
      message: 'Account created successfully 🎉',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interest: user.interest
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}

// module.exports = {
//   signup
// }



const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please enter email and password'
      })
    }

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interest: user.interest
      }
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}

const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'Please enter your email'
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email'
      })
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Save hashed token in database
    user.resetPasswordToken =
      crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Token valid for 15 minutes
    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000

    await user.save()

    // Create reset URL
    const resetUrl =
      `http://localhost:5173/reset-password/${resetToken}`

    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: user.email,

      subject: 'ProjectMate Password Reset',

      html: `
        <h2>Reset your ProjectMate password</h2>

        <p>
          You requested to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#6366f1;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>
      `
    })

    res.status(200).json({
      message:
        'Password reset link has been sent to your email'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Unable to send reset email'
    })

  }
}

const resetPassword = async (req, res) => {

  try {

    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        message: 'Please enter a new password'
      })
    }

    const hashedToken =
      crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    })

    if (!user) {

      return res.status(400).json({
        message:
          'Reset link is invalid or has expired'
      })

    }

    const hashedPassword =
      await bcrypt.hash(password, 10)

    user.password = hashedPassword

    user.resetPasswordToken = undefined

    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({
      message:
        'Password reset successful. You can now login.'
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: 'Unable to reset password'
    })

  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword
}