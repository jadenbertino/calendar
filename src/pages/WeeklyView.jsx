import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useDateContext } from '../hooks/useDateContext';
import { useModalContext } from '../hooks/useModalContext';

// components
import DisplayEvents from '../components/DisplayEvents';
import HoursList from '../components/HoursList';
import Nav from '../components/Nav';
import NewEventModal from '../components/NewEventModal';
import Sidebar from '../components/Sidebar';
import ViewEvent from '../components/ViewEvent';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

// styles
import './Views.css';

export default function WeeklyView() {
  const { user } = useAuthContext();
  const nav = useNavigate();
  const {
    dateContext,
    getShortDayName,
    incrementDateBy,
    decrementDateBy,
    formatDate,
    resetDateToToday,
    convertToHours,
    getWeek
  } = useDateContext();
  const { modalContext } = useModalContext();
  const [week, setWeek] = useState([]);
  const [weekEvents, setWeekEvents] = useState([])
  const [viewEventId, setViewEventId] = useState('')

  // if user isn't signed in redirect to signin / signup page
  useEffect(() => {
    if (!user) {
      nav('/');
    }
  }, [user]);

  useEffect(() => {
    setWeek(getWeek(dateContext));
  }, [dateContext]);

  function getEvents(formattedDate) {
    return allEvents.filter(
      event => event.date === formattedDate).sort(
        (eventA, eventB) => convertToHours(eventA.startTime) - convertToHours(eventB.startTime))
  }

  function getEvent(id) {
    return allEvents.find(e => e.id == id)
  }

  // set date + query events for date
  const query = useRef([`uid == ${user && user.uid}`]).current;
  const { events: allEvents } = useCollection('events', query);

  return (
    <>
      <Nav
        incrementDate={() => incrementDateBy(7)}
        decrementDate={() => decrementDateBy(7)}
      />
      <main>
        <Sidebar />
        <section id="weekly">
          <header className="date-wrapper">
            {week.map((date, i) => (
              <div className="date" onClick={resetDateToToday} key={i}>
                <h3 className="day-of-week">{getShortDayName(date)}</h3>
                <h2 className="day-of-month">{date.getDate()}</h2>
              </div>
            ))}
          </header>
          <div className="times-and-events">
            <HoursList />
            <div className="events">
              {week && allEvents && week.map((date, i) => (
                <DisplayEvents events={getEvents(formatDate(date))} key={i} setViewEventId={setViewEventId} />
              ))}
            </div>
          </div>
        </section>
      </main>
      {modalContext === 'newEvent' && <NewEventModal />}
      {modalContext === 'view-event' && 
        <ViewEvent event={getEvent(viewEventId)} />
      }
      {modalContext === 'edit-event' &&
        <NewEventModal eventToEdit={getEvent(viewEventId)} />
      }
      {modalContext === 'confirm-delete' &&
        <ConfirmDeleteModal id={viewEventId} />
      } 
    </>
  );
}
