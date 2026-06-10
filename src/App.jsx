import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import Register from "./pages/Register";

const ProtectedNotesRoute = ({ isAuthenticated }) => {
  const { username: paramUsername } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${paramUsername}`);
    }
  }, [isAuthenticated, navigate, paramUsername]);

  if (!isAuthenticated) {
    return null;
  }

  return <Notes />;
};

ProtectedNotesRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    navigate(`/${user}/notes`);
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register onLogin={handleLogin} />} />
      <Route path="/:username" element={<Login onLogin={handleLogin} />} />
      <Route path="/:username/notes" element={<ProtectedNotesRoute isAuthenticated={isAuthenticated} />} />
    </Routes>
  );
};

export default App;