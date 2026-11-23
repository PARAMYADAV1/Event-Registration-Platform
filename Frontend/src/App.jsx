import AdminLogin from "./pages/AdminLogin";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import MyRegistrations from "./pages/MyRegistrations";
import Admin from "./pages/Admin";
import "./App.css";

function ProtectedAdminRoute({ children }) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
}
function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="logo">EventHub</Link>

        <div className="nav-links">
          <Link to="/">Events</Link>
          <Link to="/my-registrations">My Registrations</Link>
          <Link to="/admin-login">Admin Login</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>

      <footer>
        <p>© 2026 EventHub | Event Registration System</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
