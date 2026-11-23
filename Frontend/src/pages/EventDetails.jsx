import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEvent } from "../services/api";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvent(id).then(setEvent).catch(console.error);
  }, [id]);

  if (!event) return <h2>Loading event...</h2>;

  return (
    <div className="details-container">
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>📅 {new Date(event.event_date).toLocaleDateString()}</p>
      <p>📍 {event.location}</p>
      <Link to={`/register/${event.id}`}>Register Now</Link>
    </div>
  );
}

export default EventDetails;