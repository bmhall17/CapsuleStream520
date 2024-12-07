import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LoginForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [loginUsername, setLoginUsername] = useState(''); // Username field for login
  const [loginPassword, setLoginPassword] = useState(''); // Password field for login
  const [signupUsername, setSignupUsername] = useState(''); // Username field for signup
  const [signupPassword, setSignupPassword] = useState(''); // Password field for signup
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState(''); // Password confirmation for signup
  const [signupEmail, setSignupEmail] = useState(''); // Email field for signup
  const [error, setError] = useState(''); // To store error messages
  const [isSubmitting, setIsSubmitting] = useState(false); // To track form submission state
  const [token, setToken] = useState(localStorage.getItem('token') || ''); // Track token state

  // Update token state when the token is set in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken); // Update state if token exists in localStorage
    }
  }, []);
  // Handle form submission
  const handleSubmit = async (e, type) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsSubmitting(true); // Set form submission state to true
    setError(''); // Clear previous error messages
    const username = type === 'login' ? loginUsername : signupUsername; // Get username based on form type
    const password = type === 'login' ? loginPassword : signupPassword; // Get password based on form type
    const email = type === 'signup' ? signupEmail : undefined; // Get email only for signup
    if (type === 'signup' && signupPassword !== signupPasswordConfirm) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }
    try {
      const url = type === 'login' ? 'http://localhost:5001/api/auth/login' : 'http://localhost:5001/api/auth/signup'; // Set the URL based on form type
      const response = await axios.post(url, { username, password, email }); // Make a POST request to the server
      const { token } = response.data; // Extract the token from the response
      if (token) {
        localStorage.setItem('token', token); // Store the token in localStorage
        setToken(token); // Update token state
        onAuth(token); // Pass token to parent component
        // Clear input fields
        if (type === 'login') {
          setLoginUsername('');
          setLoginPassword('');
        } else {
          setSignupUsername('');
          setSignupEmail('');
          setSignupPassword('');
          setSignupPasswordConfirm('');
        }
      } else {
        if (type === 'login') {
            setError('No token received from the server');
        } else {
            setError('Signup successful. Please login to continue');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <h3 style={{ color: 'white' }}>{isLogin ? 'Login' : 'Signup'}</h3>
      {/* Toggle between Login and Signup forms */}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </button>

      <form onSubmit={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}>
        <input
          type="text"
          placeholder="Username"
          value={isLogin ? loginUsername : signupUsername}
          onChange={(e) => (isLogin ? setLoginUsername(e.target.value) : setSignupUsername(e.target.value))}
        />
        <input
          type="password"
          placeholder="Password"
          value={isLogin ? loginPassword : signupPassword}
          onChange={(e) => (isLogin ? setLoginPassword(e.target.value) : setSignupPassword(e.target.value))}
        />
        {!isLogin && (
          <>
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupPasswordConfirm}
              onChange={(e) => setSignupPasswordConfirm(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
          </>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm; // Export the LoginForm component





