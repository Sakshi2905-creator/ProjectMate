const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const userRoutes = require('./routes/userRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const matchRoutes = require('./routes/matchRoutes')
const activityRoutes = require('./routes/activityRoutes')
const taskRoutes = require('./routes/taskRoutes')

const app = express()

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean)

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. health checks).
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
)

app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/tasks', taskRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'ProjectMate API is running 🚀'
  })
})

const PORT = process.env.PORT || 5000

// Start server only after successful database connection
const startServer = async () => {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()