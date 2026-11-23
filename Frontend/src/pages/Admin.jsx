
import { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const emptyForm = {
  title: "",
  description: "",
  event_date: "",
  location: ""
};

function Admin() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const adminFetch = (url, options = {}) => {
    const token = localStorage.getItem("adminToken");

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    });
};

  
const loadData = async () => {
    try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "/admin-login";
            return;
        }

        const headers = {
            Authorization: `Bearer ${token}`
        };

        const [eventResponse, registrationResponse] = await Promise.all([
            fetch(`${API}/events`, { headers }),
            fetch(`${API}/registrations`, { headers })
        ]);

        if (eventResponse.status === 401 ||
            registrationResponse.status === 401 ||
            eventResponse.status === 403 ||
            registrationResponse.status === 403) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminData");
            window.location.href = "/admin-login";
            return;
        }

        if (!eventResponse.ok || !registrationResponse.ok) {
            const errorData = await registrationResponse.json();
            throw new Error(errorData.message || "Unable to load admin data");
        }

        const eventData = await eventResponse.json();
        const registrationData = await registrationResponse.json();

        setEvents(eventData);
        setRegistrations(registrationData);
        setMessage("");
    } catch (error) {
        setMessage(error.message);
    }
};


  useEffect(() => {
    loadData();
  }, []);
const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    window.location.href = "/admin-login";
};
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "/admin-login";
            return;
        }

        const url = editingId
            ? `${API}/events/${editingId}`
            : `${API}/events`;

        const response = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Event operation failed");
        }

        setMessage(result.message);
        setForm(emptyForm);
        setEditingId(null);

        await loadData();

    } catch (error) {
        setMessage(error.message);
    }
};


  const editEvent = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: String(event.event_date).slice(0, 10),
      location: event.location || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
     const response = await fetch(`${API}/events/${id}`, {
    method: "DELETE",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
    }
});
       if (!token) {
            window.location.href = "/admin-login";
            return;
        }
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setMessage(result.message);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  return (
    <main className="admin-container">
      <section className="admin-heading">
        <h1>Admin Dashboard</h1>
        <p>Manage events and monitor registrations.</p>
      </section>
          <button onClick={handleLogout}>Logout</button>
      {message && <div className="admin-message">{message}</div>}

      <section className="admin-stats">
        <div className="admin-stat">
          <h2>{events.length}</h2>
          <p>Total Events</p>
        </div>
        <div className="admin-stat">
          <h2>{registrations.length}</h2>
          <p>Total Registrations</p>
        </div>
        <div className="admin-stat">
          <h2>{new Set(registrations.map(r => r.email)).size}</h2>
          <p>Registered Users</p>
        </div>
      </section>

      <section className="admin-panel">
        <h2>{editingId ? "Edit Event" : "Add New Event"}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Event description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Event location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <div className="admin-form-actions">
            <button type="submit">
              {editingId ? "Update Event" : "Add Event"}
            </button>

            {editingId && (
              <button type="button" className="secondary-button" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <h2>Manage Events</h2>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{String(event.event_date).slice(0, 10)}</td>
                  <td>{event.location}</td>
                  <td>
                    <button onClick={() => editEvent(event)}>Edit</button>
                    <button
                      className="delete-button"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan="5">No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <h2>All Registrations</h2>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Participant</th>
                <th>Email</th>
                <th>Event</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(item => (
                <tr key={item.registration_id}>
                  <td>{item.registration_id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.event_title}</td>
                  <td>{String(item.event_date).slice(0, 10)}</td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr><td colSpan="5">No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Admin;
