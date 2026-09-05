const User = require('../models/User')

const getSmartMatches = async (req, res) => {
  try {
    const userId = req.params.userId

    const currentUser = await User.findById(userId)

    if (!currentUser) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const currentSkills = (currentUser.skills || []).map(skill =>
      skill.toLowerCase()
    )

    const users = await User.find({
      _id: { $ne: userId }
    }).select('name email skills interest')

    const matches = users.map(user => {

      const userSkills = (user.skills || []).map(skill =>
        skill.toLowerCase()
      )

      const commonSkills = userSkills.filter(skill =>
        currentSkills.includes(skill)
      )

      let matchPercentage = 0

      if (currentSkills.length > 0) {
        matchPercentage = Math.round(
          (commonSkills.length / currentSkills.length) * 100
        )
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        interest: user.interest,
        skills: user.skills || [],
        commonSkills,
        matchPercentage
      }
    })

    const sortedMatches = matches
      .filter(user => user.matchPercentage > 0)
      .sort(
        (a, b) =>
          b.matchPercentage - a.matchPercentage
      )
      .slice(0, 5)

    res.status(200).json({
      matches: sortedMatches
    })

  } catch (error) {

    console.error('Smart match error:', error)

    res.status(500).json({
      message: 'Server error'
    })
  }
}

module.exports = {
  getSmartMatches
}