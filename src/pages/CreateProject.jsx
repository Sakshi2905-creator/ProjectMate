import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateProject.css'

function CreateProject() {

  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('user')
  )
 console.log("USER DATA:", user)
  const [formData, setFormData] = useState({

    title: '',
    description: '',
    category: '',
    difficulty: 'Intermediate',
    techStack: '',
    requiredSkills: '',
    teamSize: 2,
    deadline: ''

  })


  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')


  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    })

  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setLoading(true)


    try {

      const response = await fetch(
        'http://localhost:5000/api/projects',
        {

          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({

            ...formData,

            techStack: formData.techStack
              .split(',')
              .map(skill => skill.trim())
              .filter(Boolean),

            requiredSkills: formData.requiredSkills
              .split(',')
              .map(skill => skill.trim())
              .filter(Boolean),

            teamSize: Number(formData.teamSize),

            owner: user.id

          })

        }
      )


      const data = await response.json()


      if (!response.ok) {

        setError(
          data.message || 'Something went wrong'
        )

        return

      }


      alert('Project created successfully 🚀')

      navigate('/dashboard')


    } catch (error) {

      setError(
        'Unable to connect to server'
      )

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="create-project-page">

      <div className="create-project-container">


        {/* HEADER */}

        <div className="create-project-header">

          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Dashboard
          </button>

          <p>
            PROJECT WORKSPACE
          </p>

          <h1>
            Create something <span>great.</span>
          </h1>

          <p>
            Turn your idea into a project and
            find the right people to build it.
          </p>

        </div>


        {/* FORM */}

        <form
          className="project-form"
          onSubmit={handleSubmit}
        >


          {/* BASIC INFO */}

          <div className="form-section">

            <div className="form-section-heading">

              <span>01</span>

              <div>

                <h2>
                  Project basics
                </h2>

                <p>
                  Tell people what you're building.
                </p>

              </div>

            </div>


            <div className="form-group">

              <label>
                Project Name
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AI Study Assistant"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What problem does your project solve?"
                rows="5"
                required
              />

            </div>


            <div className="two-column">

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="App Development">
                    App Development
                  </option>

                  <option value="AI / ML">
                    AI / ML
                  </option>

                  <option value="Cyber Security">
                    Cyber Security
                  </option>

                  <option value="IoT">
                    IoT
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

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

          </div>


          {/* TECH STACK */}

          <div className="form-section">

            <div className="form-section-heading">

              <span>02</span>

              <div>

                <h2>
                  Skills & technology
                </h2>

                <p>
                  Help us find the right teammates.
                </p>

              </div>

            </div>


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
                Separate technologies using commas.
              </small>

            </div>


            <div className="form-group">

              <label>
                Required Skills
              </label>

              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="React, UI/UX, Python"
                required
              />

              <small>
                These skills will power our future
                Smart Match system.
              </small>

            </div>

          </div>


          {/* TEAM */}

          <div className="form-section">

            <div className="form-section-heading">

              <span>03</span>

              <div>

                <h2>
                  Build your team
                </h2>

                <p>
                  Tell us what kind of team you need.
                </p>

              </div>

            </div>


            <div className="two-column">

              <div className="form-group">

                <label>
                  Team Size
                </label>

                <select
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                >

                  <option value="1">
                    1 member
                  </option>

                  <option value="2">
                    2 members
                  </option>

                  <option value="3">
                    3 members
                  </option>

                  <option value="4">
                    4 members
                  </option>

                  <option value="5">
                    5 members
                  </option>

                  <option value="6">
                    6+ members
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Target Deadline
                </label>

                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="project-error">
              {error}
            </div>

          )}


          {/* SUBMIT */}

          <div className="form-submit">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="create-btn"
              disabled={loading}
            >

              {loading
                ? 'Creating...'
                : 'Create Project 🚀'}

            </button>

          </div>


        </form>

      </div>

    </div>

  )
}

export default CreateProject