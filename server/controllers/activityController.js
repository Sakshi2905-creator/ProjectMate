const Activity = require('../models/Activity')

const getRecentActivities = async (req, res) => {

  try {

    const userId = req.params.userId

    const activities = await Activity.find({
      user: userId
    })
      .populate('project', 'title')
      .sort({ createdAt: -1 })
      .limit(5)

    res.status(200).json({
      activities
    })

  } catch (error) {

    console.error(
      'Activity error:',
      error
    )

    res.status(500).json({
      message: 'Server error'
    })
  }
}

module.exports = {
  getRecentActivities
}