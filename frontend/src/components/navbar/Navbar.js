import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css'; // Create a CSS file for styling the navbar

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect the user to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">CapsuleStream</div>
      <ul className="navbar-links">
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
        <li><Link to="/">Home</Link></li>
        <li><Link to="/users">Users</Link></li>
        <li><Link to="/tags">Tags</Link></li>
        <li><Link to="/top-photos">Trending</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; // Export the Navbar component
