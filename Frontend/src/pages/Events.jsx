
import { useEffect, useState } from "react";
import { getEvents } from "../services/api";
 import { Link } from "react-router-dom";
             

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading events...</h2>;
  if (error) return <p>{error}</p>;

  return (
    <div className="events-container">
      <h1>Upcoming Events</h1>
      <p>Explore and register for upcoming events.</p>

      <div className="event-grid">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <div className="event-image">🎉</div>
            <div className="event-info">
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
              <p>📍 {event.location}</p>
            <Link to={`/event/${event.id}`}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;
