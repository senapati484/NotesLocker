import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import Register from "./pages/Register";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    navigate(`/${user}/notes`);
  };

  const ProtectedNotesRoute = () => {
    const { username: paramUsername } = useParams(); // Get the dynamic username from the route

    useEffect(() => {
      if (!isAuthenticated) {
        navigate(`/${paramUsername}`); // Redirect to /:username if not authenticated
      }
    }, [isAuthenticated, navigate, paramUsername]);

    if (!isAuthenticated) {
      return null; // Don't render Notes if not authenticated
    }

    return <Notes />; // Render Notes if authenticated
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/:username" element={<Login onLogin={handleLogin} />} />
      <Route path="/:username/notes" element={<ProtectedNotesRoute />} />
    </Routes>
  );
};

export default App;
