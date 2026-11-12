const API_URL = 'http://localhost:5000/api/activities'

const getToken = () =>
  localStorage.getItem('token') ||
  sessionStorage.getItem('token')

export const getProjectActivities = async (projectId) => {
  const token = getToken()

  if (!token) {
    throw new Error('Please log in to continue.')
  }

  const response = await fetch(
    `${API_URL}/project/${projectId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.message || 'Unable to fetch project activities.'
    )
  }

  return data.activities
}