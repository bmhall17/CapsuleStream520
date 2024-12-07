import React, { useState } from 'react';
import LoginForm from './LoginForm'; //import LoginForm component
import { useNavigate } from 'react-router-dom'; //import useNavigate

const LoginPage = () => {
  const [token, setToken] = useState(null); //state to store token
  const navigate = useNavigate(); //access navigate function
  // Function to handle authentication
  const handleAuth = (receivedToken) => {
    localStorage.setItem('token', receivedToken); //save login token
    setToken(receivedToken); //set token state
    navigate('/'); //navigate to main feed
  };
  return (
    <div>
      <h1>Login/Sign Up</h1>
      <LoginForm onAuth={handleAuth} /> {/* Pass the handleAuth function to LoginForm */}
    </div>
  );
};

export default LoginPage; //export LoginPage component

