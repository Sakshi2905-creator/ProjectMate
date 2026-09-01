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

  const [interest, setInterest] = useState(
  storedUser?.interest || 'both'
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

const interestResponse = await fetch(
  `http://localhost:5000/api/users/${storedUser.id}/interest`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      interest
    })
  }
)

const interestData = await interestResponse.json()

if (!interestResponse.ok) {

  setMessage(
    interestData.message ||
    'Failed to save interest'
  )

  return
}

      if (!response.ok) {

        setMessage(
          data.message || 'Something went wrong'
        )

        return
      }


      // Update localStorage

      const updatedUser = {
  ...storedUser,
  skills: data.user.skills,
  interest: interestData.user.interest
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
   
   <div className="interest-section">

  <div className="interest-heading">

    <span>
      PROJECT PREFERENCE
    </span>

    <h2>
      What are you looking for?
    </h2>

    <p>
      Tell us how you want to use ProjectMate.
    </p>

  </div>


  <div className="interest-options">

    <button
      type="button"
      className={
        interest === 'build'
          ? 'interest-btn selected'
          : 'interest-btn'
      }
      onClick={() => setInterest('build')}
    >
      <strong>🚀</strong>

      <div>
        <b>Build Projects</b>
        <small>
          I want to create and lead projects.
        </small>
      </div>
    </button>


    <button
      type="button"
      className={
        interest === 'join'
          ? 'interest-btn selected'
          : 'interest-btn'
      }
      onClick={() => setInterest('join')}
    >
      <strong>🤝</strong>

      <div>
        <b>Join Projects</b>
        <small>
          I want to contribute to existing projects.
        </small>
      </div>
    </button>


    <button
      type="button"
      className={
        interest === 'both'
          ? 'interest-btn selected'
          : 'interest-btn'
      }
      onClick={() => setInterest('both')}
    >
      <strong>✨</strong>

      <div>
        <b>Both</b>
        <small>
          I want to build and join projects.
        </small>
      </div>
    </button>

  </div>

</div>

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