
import { useState } from "react";
import { getRegistrations, cancelRegistration } from "../services/api";

function MyRegistrations() {
  const [email, setEmail] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");

  const search = async () => {
    try {
      setRegistrations(await getRegistrations(email));
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const cancel = async (id) => {
    try {
      const result = await cancelRegistration(id, email);
      setMessage(result.message);
      setRegistrations(await getRegistrations(email));
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="form-container">
      <h1>My Registrations</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={search}>View Registrations</button>

      {message && <p>{message}</p>}

      {registrations.map(item => (
        <div className="event-card" key={item.registration_id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
          <p>{item.location}</p>
          <p>{new Date(item.event_date).toLocaleDateString()}</p>
          <button onClick={() => cancel(item.registration_id)}>
            Cancel Registration
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyRegistrations;
