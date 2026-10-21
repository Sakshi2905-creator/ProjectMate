import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Discover.css'

function Discover() {
  const navigate = useNavigate()

  const [user] = useState(() => {
    const storedUser =
      localStorage.getItem('user') ||
      sessionStorage.getItem('user')

    if (!storedUser) return null

    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  })
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [matches, setMatches] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')
const [sortBy, setSortBy] = useState('newest')

  // ================================
  // CHECK LOGIN + GET USER
  // ================================
  useEffect(() => {
    const token =
      localStorage.getItem('token') ||
      sessionStorage.getItem('token')

    if (!token || !user) {
      navigate('/login')
    }
  }, [navigate, user])

  // ================================
  // FETCH PROJECTS
  // ================================
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          'http://localhost:5000/api/projects'
        )

        const data = await response.json()

        if (response.ok) {
          setProjects(data.projects || [])
        } else {
          setError(data.message || 'Failed to fetch projects')
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        setError('Unable to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // ================================
  // FETCH MATCH PERCENTAGES
  // ================================
  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.id || projects.length === 0) {
        return
      }

      const matchResults = {}

      for (const project of projects) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/projects/${project._id}/match/${user.id}`
          )

          const data = await response.json()

          if (response.ok) {
            matchResults[project._id] =
              data.matchPercentage
          }
        } catch (error) {
          console.error(
            'Error calculating match:',
            error
          )
        }
      }

      setMatches(matchResults)
    }

    fetchMatches()
  }, [projects, user])

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')

    navigate('/login')
  }

  // ================================
// SEARCH, FILTER AND SORT
// ================================

const categories = [
  ...new Set(
    projects
      .map(project => project.category)
      .filter(Boolean)
  )
].sort()

const filteredProjects = projects
  .filter(project => {
    const query = searchQuery.trim().toLowerCase()

    const searchableText = [
      project.title,
      project.description,
      project.category,
      project.difficulty,
      ...(project.techStack || []),
      ...(project.requiredSkills || [])
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchableText.includes(query)

    const matchesCategory =
      selectedCategory === 'All' ||
      project.category === selectedCategory

    return matchesSearch && matchesCategory
  })
  .sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    }

    if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0) -
        new Date(b.createdAt || 0)
    }

    if (sortBy === 'team-availability') {
      const availableA =
        Number(a.teamSize || 0) -
        (a.members?.length || 0)

      const availableB =
        Number(b.teamSize || 0) -
        (b.members?.length || 0)

      return availableB - availableA
    }

    return 0
  })

  // ================================
  // LOADING
  // ================================
  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="discover-page">

        {/* NAVBAR */}
        <nav className="discover-navbar">

          <div
            className="discover-brand"
            onClick={() => navigate('/dashboard')}
          >
            Project<span>Mate</span>
          </div>

          <div className="discover-nav-links">

            <button
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <button className="active">
              Discover
            </button>

            <button
              onClick={() => navigate('/my-projects')}
            >
              My Projects
            </button>

            <button
              onClick={() => navigate('/teams')}
            >
              Teams
            </button>

          </div>

          <div className="discover-profile">

            <div className="discover-user-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="discover-user-info">
              <strong>{user.name}</strong>
              <small>Builder</small>
            </div>

            <button
              className="discover-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </nav>

        <div className="discover-loading">
          <p>Finding projects for you...</p>
        </div>

      </div>
    )
  }

  return (
    <div className="discover-page">

      {/* =================================
          NAVBAR
      ================================= */}

      <nav className="discover-navbar">

        {/* LOGO */}

        <div
          className="discover-brand"
          onClick={() => navigate('/dashboard')}
        >
          Project<span>Mate</span>
        </div>


        {/* NAVIGATION LINKS */}

        <div className="discover-nav-links">

          <button
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

          <button className="active">
            Discover
          </button>

          <button
            onClick={() => navigate('/projects')}
            >
            My Projects
          </button>

          <button
            onClick={() => navigate('/teams')}
          >
            Teams
          </button>

        </div>


        {/* USER PROFILE */}

        <div className="discover-profile">

          <div className="discover-user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="discover-user-info">
            <strong>{user.name}</strong>
            <small>Builder</small>
          </div>

          <button
            className="discover-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =================================
          HEADER
      ================================= */}

      <header className="discover-header">

        <div>

          <span className="discover-label">
            EXPLORE
          </span>

          <h1>
            Discover Projects
          </h1>

          <p>
            Find projects where your skills
            can make an impact.
          </p>

        </div>

      </header>

      {/* SEARCH AND FILTERS */}

<section className="discover-search-section">

  <div className="discover-search-box">
    <span className="discover-search-icon">⌕</span>

    <input
      type="search"
      className="discover-search-input"
      placeholder="Search projects, technologies, or skills..."
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      aria-label="Search projects"
    />

    {searchQuery && (
      <button
        type="button"
        className="discover-clear-search"
        onClick={() => setSearchQuery('')}
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>

  <div className="discover-filter-row">

    <div className="discover-filter-group">
      <label htmlFor="project-category-filter">
        Category
      </label>

      <select
        id="project-category-filter"
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="All">All Categories</option>

        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>

    <div className="discover-filter-group">
      <label htmlFor="project-sort">
        Sort by
      </label>

      <select
        id="project-sort"
        value={sortBy}
        onChange={e => setSortBy(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="team-availability">
          Most Team Availability
        </option>
      </select>
    </div>

    <button
      type="button"
      className="discover-reset-filters"
      onClick={() => {
        setSearchQuery('')
        setSelectedCategory('All')
        setSortBy('newest')
      }}
    >
      Reset Filters
    </button>

  </div>

  <p className="discover-results-count" aria-live="polite">
    Showing {filteredProjects.length} of {projects.length} projects
  </p>

</section>
      {/* =================================
          PROJECTS
      ================================= */}

      <main className="discover-container">

        {error && (
          <div className="discover-error">
            {error}
          </div>
        )}

        {filteredProjects.length === 0 ? (

          <div className="empty-discover">

           <h2>
  {projects.length === 0
    ? 'No projects found'
    : 'No matching projects'}
</h2>

<p>
  {projects.length === 0
    ? 'Be the first to create a project.'
    : 'Try a different keyword or reset your filters.'}
</p>

{projects.length === 0 && (
  <button
    onClick={() => navigate('/create-project')}
  >
    + Create Project
  </button>
)}

          </div>

        ) : (

          <div className="discover-grid">

            {filteredProjects.map(project => (

              <article
                className="discover-card"
                key={project._id}
              >

                {/* CARD TOP */}

                <div className="discover-card-top">

                  <div className="discover-logo">
                    {project.title
                      ?.substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <span className="difficulty">
                    {project.difficulty}
                  </span>

                  {matches[project._id] !== undefined && (
                    <span className="match-score">
                      ⚡ {matches[project._id]}% Match
                    </span>
                  )}

                </div>


                {/* CATEGORY */}

                <span className="category">
                  {project.category}
                </span>


                {/* TITLE */}

                <h2>
                  {project.title}
                </h2>


                {/* DESCRIPTION */}

                <p>
                  {project.description}
                </p>


                {/* TECH STACK */}

                <div className="discover-tags">

                  {project.techStack?.map(
                    (tech, index) => (

                      <span key={index}>
                        {tech}
                      </span>

                    )
                  )}

                </div>


                {/* FOOTER */}

                <div className="discover-card-footer">

                  <div>

                    <small>
                      Team
                    </small>

                    <strong>
                      {project.members?.length || 0}
                      {' / '}
                      {project.teamSize}
                    </strong>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/project/${project._id}`
                      )
                    }
                  >
                    View Project →
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default Discover