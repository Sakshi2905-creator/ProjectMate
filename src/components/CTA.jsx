import { useNavigate } from 'react-router-dom'

function CTA() {

  const navigate = useNavigate()


  const handleStartBuilding = () => {

    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    navigate('/create-project')

  }


  return (

    <section
      className="cta"
      id="projects"
    >

      <h2>
        Have an idea?
        <br />
        <span>
          Let's build it together.
        </span>
      </h2>


      <p>
        Create your project, find your teammates,
        and start building something amazing.
      </p>


      <button
        className="primary-btn"
        onClick={handleStartBuilding}
      >
        Start Building
      </button>

    </section>
  )
}

export default CTA