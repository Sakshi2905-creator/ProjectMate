const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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

module.exports = {
  signup,
  login
}