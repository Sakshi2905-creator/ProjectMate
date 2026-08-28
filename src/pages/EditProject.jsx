import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './EditProject.css'

function EditProject() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Intermediate',
    techStack: '',
    requiredSkills: '',
    teamSize: '',
    deadline: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')


  // FETCH EXISTING PROJECT

  useEffect(() => {

    const fetchProject = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/projects/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          setError(
            data.message || 'Project not found'
          )
          return
        }

        const project = data.project

        setFormData({
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          difficulty: project.difficulty || 'Intermediate',

          techStack:
            project.techStack?.join(', ') || '',

          requiredSkills:
            project.requiredSkills?.join(', ') || '',

          teamSize: project.teamSize || '',

          deadline: project.deadline
            ? project.deadline.substring(0, 10)
            : ''
        })

      } catch (error) {

        console.error(error)

        setError(
          'Unable to load project'
        )

      } finally {

        setLoading(false)

      }

    }

    fetchProject()

  }, [id])


  // HANDLE INPUT

  const handleChange = (event) => {

    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

  }


  // UPDATE PROJECT

  const handleSubmit = async (event) => {

    event.preventDefault()

    try {

      setSaving(true)
      setMessage('')
      setError('')

      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            title: formData.title,

            description:
              formData.description,

            category:
              formData.category,

            difficulty:
              formData.difficulty,

            techStack:
              formData.techStack
                .split(',')
                .map(item => item.trim())
                .filter(Boolean),

            requiredSkills:
              formData.requiredSkills
                .split(',')
                .map(item => item.trim())
                .filter(Boolean),

            teamSize:
              Number(formData.teamSize),

            deadline:
              formData.deadline

          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setError(
          data.message ||
          'Failed to update project'
        )

        return

      }

      setMessage(
        'Project updated successfully! 🎉'
      )

      setTimeout(() => {
        navigate(`/project/${id}`)
      }, 1000)

    } catch (error) {

      console.error(error)

      setError(
        'Unable to connect to server'
      )

    } finally {

      setSaving(false)

    }

  }


  if (loading) {

    return (
      <div className="edit-project-page">

        <div className="edit-loading">
          Loading project...
        </div>

      </div>
    )

  }


  if (error) {

    return (
      <div className="edit-project-page">

        <div className="edit-error">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={() =>
              navigate(`/project/${id}`)
            }
          >
            ← Back to Project
          </button>

        </div>

      </div>
    )

  }


  return (

    <div className="edit-project-page">

      {/* HEADER */}

      <header className="edit-project-header">

        <button
          className="edit-back-btn"
          onClick={() =>
            navigate(`/project/${id}`)
          }
        >
          ← Back to Project
        </button>

        <div>

          <span className="edit-label">
            PROJECT MANAGEMENT
          </span>

          <h1>
            Edit Project
          </h1>

          <p>
            Update your project details and
            requirements.
          </p>

        </div>

      </header>


      {/* FORM */}

      <main className="edit-project-container">

        <form
          className="edit-project-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="form-group">

            <label>
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>


          {/* CATEGORY + DIFFICULTY */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Difficulty
              </label>

              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>

          </div>


          {/* TECH STACK */}

          <div className="form-group">

            <label>
              Tech Stack
            </label>

            <input
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              required
            />

            <small>
              Separate technologies with commas.
            </small>

          </div>


          {/* REQUIRED SKILLS */}

          <div className="form-group">

            <label>
              Required Skills
            </label>

            <input
              type="text"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              placeholder="React, JavaScript, Git"
              required
            />

            <small>
              Separate skills with commas.
            </small>

          </div>


          {/* TEAM SIZE + DEADLINE */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Team Size
              </label>

              <input
                type="number"
                name="teamSize"
                min="1"
                value={formData.teamSize}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />

            </div>

          </div>


          {/* MESSAGE */}

          {message && (

            <div className="edit-success">
              {message}
            </div>

          )}


          {error && (

            <div className="edit-error-message">
              {error}
            </div>

          )}


          {/* ACTIONS */}

          <div className="edit-form-actions">

            <button
              type="button"
              className="cancel-edit-btn"
              onClick={() =>
                navigate(`/project/${id}`)
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-project-btn"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </form>

      </main>

    </div>

  )

}

export default EditProject