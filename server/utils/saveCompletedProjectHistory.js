const CompletedProject = require('../models/CompletedProject')

const saveCompletedProjectHistory = async (project) => {
  if (!project || project.status !== 'Completed') {
    return
  }

  const userIds = [
    project.owner,
    ...(project.members || [])
  ]

  const uniqueUserIds = [
    ...new Set(userIds.map(id => String(id)))
  ]

  const operations = uniqueUserIds.map(userId => ({
    updateOne: {
      filter: {
        user: userId,
        originalProjectId: project._id
      },
      update: {
        $setOnInsert: {
          user: userId,
          originalProjectId: project._id,
          title: project.title,
          category: project.category || '',
          completedAt: new Date()
        }
      },
      upsert: true
    }
  }))

  if (operations.length > 0) {
    await CompletedProject.bulkWrite(operations)
  }
}

module.exports = saveCompletedProjectHistory