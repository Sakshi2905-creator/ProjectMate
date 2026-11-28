const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API = `${API_BASE_URL}/api`

// Get token from localStorage or sessionStorage
export const getAuthHeaders = () => {
  const token =
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')

  return {
    Authorization: `Bearer ${token}`
  }
}