import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './Profile.css'

function Profile() {

  const navigate = useNavigate()
  const { id } = useParams()

   const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const storedUser = JSON.parse(
    localStorage.getItem('user')
  )

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}`
      )

      const data = await response.json()

      if (response.ok) {
        setProfile(data.user)
      } else {
        console.error(data.message)
      }

    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  if (id) {
    fetchProfile()
  } else {
    setLoading(false)
  }
}, [id])

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

  if (loading) {
  return (
    <div className="profile-page">
      <div className="profile-loading">
        Loading profile...
      </div>
    </div>
  )
}

if (id && !profile) {
  return (
    <div className="profile-page">
      <div className="profile-loading">
        Profile not found.
      </div>
    </div>
  )
}

 const isOwnProfile = !id

  const displayedProfile = id
    ? profile
    : {
        ...storedUser,
        skills: selectedSkills,
        interest: interest
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

  {displayedProfile?.name
    ?.charAt(0)
    .toUpperCase()}

</div>


            <div>

              <span className="profile-label">
  {isOwnProfile ? 'YOUR PROFILE' : 'STUDENT PROFILE'}
</span>

<h1>
  {displayedProfile?.name}
</h1>

<p>
  {displayedProfile?.email}
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

  {isOwnProfile ? (

    skills.map(skill => (

      <button
        key={skill}
        type="button"
        className={
          selectedSkills.includes(skill)
            ? 'skill-btn selected'
            : 'skill-btn'
        }
        onClick={() => toggleSkill(skill)}
      >

        {selectedSkills.includes(skill)
          ? '✓ '
          : '+'}

        {skill}

      </button>

    ))

  ) : (

    displayedProfile?.skills?.length > 0 ? (

      displayedProfile.skills.map(skill => (

        <span
          key={skill}
          className="skill-btn selected"
        >
          ✓ {skill}
        </span>

      ))

    ) : (

      <p>No skills added yet.</p>

    )

  )}

</div>


            {isOwnProfile && message && (

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

  {isOwnProfile ? (

    <>
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
    </>

  ) : (

    <div className="interest-btn selected">

      <strong>
        {displayedProfile?.interest === 'build'
          ? '🚀'
          : displayedProfile?.interest === 'join'
            ? '🤝'
            : '✨'}
      </strong>

      <div>
        <b>
          {displayedProfile?.interest === 'build'
            ? 'Build Projects'
            : displayedProfile?.interest === 'join'
              ? 'Join Projects'
              : 'Build & Join Projects'}
        </b>

        <small>
          {displayedProfile?.interest === 'build'
            ? 'Wants to create and lead projects.'
            : displayedProfile?.interest === 'join'
              ? 'Wants to contribute to existing projects.'
              : 'Wants to build and join projects.'}
        </small>
      </div>

    </div>

  )}

</div>

</div>

           {isOwnProfile && (
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
)}

          </div>

        </section>

      </main>

    </div>

  )

}

export default Profile