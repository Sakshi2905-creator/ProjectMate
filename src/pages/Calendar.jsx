import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Calendar.css'

function Calendar() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token || !storedUser) {
      navigate('/login')
      return
    }

    const loggedInUser = JSON.parse(storedUser)

    setUser(loggedInUser)

    const fetchProjects = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/projects/user/${loggedInUser.id}`
        )

        const data = await response.json()

        if (response.ok) {
          setProjects(data.projects || [])
        }

      } catch (error) {

        console.error(
          'Error fetching projects:',
          error
        )

      } finally {

        setLoading(false)

      }

    }

    fetchProjects()

  }, [navigate])


  // =========================
  // DATE HELPERS
  // =========================

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay()

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate()


  const monthName = currentDate.toLocaleString(
    'default',
    {
      month: 'long'
    }
  )


  // =========================
  // CHANGE MONTH
  // =========================

  const previousMonth = () => {

    setCurrentDate(
      new Date(year, month - 1, 1)
    )

    setSelectedDate(null)

  }


  const nextMonth = () => {

    setCurrentDate(
      new Date(year, month + 1, 1)
    )

    setSelectedDate(null)

  }


  const goToToday = () => {

    setCurrentDate(new Date())

    setSelectedDate(
      new Date()
    )

  }


  // =========================
  // PROJECT DEADLINE
  // =========================

  const getProjectsForDate = (day) => {

    return projects.filter(project => {

      if (!project.deadline) {
        return false
      }

      const deadline = new Date(
        project.deadline
      )

      return (
        deadline.getDate() === day &&
        deadline.getMonth() === month &&
        deadline.getFullYear() === year
      )

    })

  }


  const handleDateClick = (day) => {

    setSelectedDate(
      new Date(year, month, day)
    )

  }


  // =========================
  // CALENDAR DAYS
  // =========================

  const calendarDays = []

  for (let i = 0; i < firstDay; i++) {

    calendarDays.push(
      <div
        key={`empty-${i}`}
        className="calendar-day empty"
      />
    )

  }


  for (let day = 1; day <= daysInMonth; day++) {

    const dayProjects =
      getProjectsForDate(day)

    const today = new Date()

    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()


    const isSelected =
      selectedDate &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()


    calendarDays.push(

      <button
        key={day}
        className={`
          calendar-day
          ${isToday ? 'today' : ''}
          ${isSelected ? 'selected' : ''}
          ${dayProjects.length > 0 ? 'has-event' : ''}
        `}
        onClick={() =>
          handleDateClick(day)
        }
      >

        <span className="day-number">
          {day}
        </span>


        {dayProjects.length > 0 && (

          <div className="event-dots">

            {dayProjects
              .slice(0, 3)
              .map(project => (

                <span
                  key={project._id}
                  className="event-dot"
                />

              ))}

          </div>

        )}

      </button>

    )

  }


  // =========================
  // SELECTED DATE PROJECTS
  // =========================

  const selectedProjects =
    selectedDate
      ? projects.filter(project => {

          if (!project.deadline) {
            return false
          }

          const deadline =
            new Date(project.deadline)

          return (
            deadline.getDate() ===
              selectedDate.getDate() &&
            deadline.getMonth() ===
              selectedDate.getMonth() &&
            deadline.getFullYear() ===
              selectedDate.getFullYear()
          )

        })
      : []


  if (!user || loading) {

    return (
      <div className="calendar-loading">
        Loading calendar...
      </div>
    )

  }


  return (

    <div className="calendar-page">

      {/* ================= HEADER ================= */}

      <header className="calendar-header">

        <button
          className="calendar-back"
          onClick={() =>
            navigate('/dashboard')
          }
        >
          ← Dashboard
        </button>


        <div>

          <span className="calendar-label">
            YOUR SCHEDULE
          </span>

          <h1>
            Project Calendar
          </h1>

          <p>
            Keep track of your project deadlines
            and upcoming work.
          </p>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="calendar-container">

        <section className="calendar-card">


          {/* CALENDAR TOP */}

          <div className="calendar-top">

            <div>

              <h2>
                {monthName} {year}
              </h2>

              <p>
                {projects.length} project
                {projects.length !== 1
                  ? 's'
                  : ''}
              </p>

            </div>


            <div className="calendar-controls">

              <button
                onClick={goToToday}
              >
                Today
              </button>

              <button
                onClick={previousMonth}
              >
                ←
              </button>

              <button
                onClick={nextMonth}
              >
                →
              </button>

            </div>

          </div>


          {/* WEEK DAYS */}

          <div className="weekdays">

            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>

          </div>


          {/* CALENDAR */}

          <div className="calendar-grid">

            {calendarDays}

          </div>


          {/* LEGEND */}

          <div className="calendar-legend">

            <div>
              <span className="legend-dot" />
              Project deadline
            </div>

            <div>
              <span className="legend-today" />
              Today
            </div>

          </div>

        </section>


        {/* ================= SELECTED DATE ================= */}

        <aside className="calendar-events">

          <span className="calendar-label">
            {selectedDate
              ? 'SELECTED DATE'
              : 'UPCOMING'}
          </span>


          <h2>

            {selectedDate
              ? selectedDate.toLocaleDateString(
                  'default',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }
                )
              : 'Project Deadlines'}

          </h2>


          {selectedDate ? (

            selectedProjects.length === 0 ? (

              <div className="no-events">

                <div>
                  📅
                </div>

                <p>
                  No project deadline on
                  this date.
                </p>

              </div>

            ) : (

              selectedProjects.map(project => (

                <div
                  className="event-card"
                  key={project._id}
                >

                  <div className="event-icon">
                    {project.title
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {project.title}
                    </strong>

                    <small>
                      {project.status}
                    </small>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/project/${project._id}`
                      )
                    }
                  >
                    View →
                  </button>

                </div>

              ))

            )

          ) : (

            projects
              .filter(project => {

                if (!project.deadline) {
                  return false
                }

                return (
                  new Date(project.deadline)
                    >= new Date()
                )

              })
              .sort(
                (a, b) =>
                  new Date(a.deadline) -
                  new Date(b.deadline)
              )
              .slice(0, 4)
              .map(project => (

                <div
                  className="event-card"
                  key={project._id}
                >

                  <div className="event-icon">
                    {project.title
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>


                  <div>

                    <strong>
                      {project.title}
                    </strong>

                    <small>

                      Deadline:{' '}

                      {new Date(
                        project.deadline
                      ).toLocaleDateString(
                        'default',
                        {
                          day: 'numeric',
                          month: 'short'
                        }
                      )}

                    </small>

                  </div>


                  <button
                    onClick={() =>
                      navigate(
                        `/project/${project._id}`
                      )
                    }
                  >
                    View →
                  </button>

                </div>

              ))

          )}

        </aside>

      </main>

    </div>

  )

}

export default Calendar