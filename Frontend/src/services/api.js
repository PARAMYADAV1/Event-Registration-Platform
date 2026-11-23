
const API_URL = "http://localhost:5000/api";

export const getEvents = async () => {
  const response = await fetch(`${API_URL}/events`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch events");
  return data;
};

export const getEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Event not found");
  return data;
};

export const registerForEvent = async (eventId, userData) => {
  const response = await fetch(`${API_URL}/registrations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      event_id: Number(eventId)
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Registration failed");
  return data;
};

export const getRegistrations = async (email) => {
  const response = await fetch(
    `${API_URL}/registrations/user/${encodeURIComponent(email)}`
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Could not fetch registrations");
  return data;
};

export const cancelRegistration = async (id, email) => {
  const response = await fetch(`${API_URL}/registrations/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Cancellation failed");
  return data;
};
