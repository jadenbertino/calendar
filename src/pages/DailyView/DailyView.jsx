import { useEffect, useState } from 'react'
import { Nav, Sidebar, NewEventModal } from '../../components/components'
import { useModalContext } from '../../hooks/useModalContext'
import { useDateContext } from '../../hooks/useDateContext'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'

// styles
import './DailyView.css'

export default function DailyView() {
  const { user } = useAuthContext()
  const { dateContext, formatDate, incrementDateBy, decrementDateBy, dayName, dayOfMonth, formattedDate } = useDateContext()
  const {modalContext} = useModalContext()

  const [events, setEvents] = useState([])

  // if user isn't signed in redirect to signin / signup page
  const nav = useNavigate()
  useEffect(() => {
    if (!user) {
      nav('/')
    }
  }, [user])

  return (<>
    <Nav>
      <button onClick={() => decrementDateBy(1)} className="btn nav-date-btn">
        <i className="fa-solid fa-angle-left"></i>
      </button>
      <button onClick={() => incrementDateBy(1)} className="btn nav-date-btn">
        <i className="fa-solid fa-angle-right"></i>
      </button>
    </Nav>

    <main>
      <Sidebar/>
      <div className="day-of-month">
        <h3>{dayName}</h3>
        <h2>{dayOfMonth}</h2>
      </div>
      {modalContext === "newEvent" && <NewEventModal/> }
    </main>
  </>)
}