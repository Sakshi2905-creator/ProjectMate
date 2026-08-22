import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile() {

  const navigate = useNavigate()

  const storedUser = JSON.parse(
    localStorage.getItem('user')
  )

  const [selectedSkills, setSelectedSkills] = useState(
    storedUser?.skills || []
  )

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')


  const skills = [
    'C++',
    'Java',
    'Python',
    'JavaScript',
    'React',
    'Node.js',
    'Express.js',
    'MongoDB',
    'SQL',
    'HTML',
    'CSS',
    'Tailwind CSS',
    'UI/UX',
    'Figma',
    'Machine Learning',
    'Data Analytics',
    'Git',
    'GitHub'
  ]


  const toggleSkill = (skill) => {

    setSelectedSkills(prev => {

      if (prev.includes(skill)) {

        return prev.filter(
          item => item !== skill
        )

      }

      return [...prev, skill]

    })

  }


  const saveSkills = async () => {

    if (!storedUser?.id) {
      return
    }

    try {

      setSaving(true)
      setMessage('')

      const response = await fetch(
        `http://localhost:5000/api/users/${storedUser.id}/skills`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            skills: selectedSkills
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {

        setMessage(
          data.message || 'Something went wrong'
        )

        return
      }


      // Update localStorage

      const updatedUser = {
        ...storedUser,
        skills: data.user.skills
      }

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      setMessage(
        'Skills saved successfully ✓'
      )

    } catch (error) {

      console.error(error)

      setMessage(
        'Unable to save skills'
      )

    } finally {

      setSaving(false)

    }

  }


  return (

    <div className="profile-page">


      {/* HEADER */}

      <header className="profile-header">

        <button
          onClick={() => navigate('/dashboard')}
          className="profile-back"
        >
          ← Dashboard
        </button>

        <span>
          Project<span>Mate</span>
        </span>

      </header>


      {/* CONTENT */}

      <main className="profile-container">


        <section className="profile-card">


          <div className="profile-intro">

            <div className="profile-avatar">

              {storedUser?.name
                ?.charAt(0)
                .toUpperCase()}

            </div>


            <div>

              <span className="profile-label">
                YOUR PROFILE
              </span>

              <h1>
                {storedUser?.name}
              </h1>

              <p>
                {storedUser?.email}
              </p>

            </div>

          </div>


          <div className="skills-section">

            <div className="skills-heading">

              <div>

                <span>
                  YOUR EXPERTISE
                </span>

                <h2>
                  What can you build?
                </h2>

                <p>
                  Select the skills you know.
                  We'll use them to find better
                  project and teammate matches.
                </p>

              </div>


              <strong>
                {selectedSkills.length} selected
              </strong>

            </div>


            <div className="skills-grid">

              {skills.map(skill => (

                <button
                  key={skill}
                  type="button"
                  className={
                    selectedSkills.includes(skill)
                      ? 'skill-btn selected'
                      : 'skill-btn'
                  }
                  onClick={() =>
                    toggleSkill(skill)
                  }
                >

                  {selectedSkills.includes(skill)
                    ? '✓ '
                    : '+'}

                  {skill}

                </button>

              ))}

            </div>


            {message && (

              <p className="skill-message">
                {message}
              </p>

            )}


            <div className="skills-actions">

              <button
                className="save-skills-btn"
                onClick={saveSkills}
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Skills →'}
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>

  )

}

export default Profile