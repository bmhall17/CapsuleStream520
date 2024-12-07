import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostList from './components/posts/PostList';
import PostPage from './components/posts/PostPage';
import LoginPage from './components/logins/LoginPage';
import Navbar from './components/navbar/Navbar';
import TagPage from './components/tags/TagPage';
import UserPostsPage from './components/user_posts/UserPostsPage';
import SettingPage from './components/settings/SettingPage';
import TopPhotosPage from './components/top_photos/TopPhotosPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    // Check if there is a token and set the authentication state accordingly
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'SET_AUTHENTICATED', payload: token });
    } else {
      dispatch({ type: 'SET_UNAUTHENTICATED' });
    }
  }, [dispatch]);

  return (
    <div className="app">
      <header>
        <Navbar /> {/* Include the Navbar component here */}
      </header>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Post list route (only accessible if authenticated) */}
        <Route
          path="/"
          element={state.isAuthenticated ? <PostList /> : <Navigate to="/login" />}
        />

        {/* Post details page (protected route) */}
        <Route
          path="/post/:id"
          element={
            <ProtectedRoute isAuthenticated={state.isAuthenticated}>
              <PostPage />
            </ProtectedRoute>
          }
        />
        {/* Tag page route */}
        <Route
          path="/tags"
          element={
            <ProtectedRoute isAuthenticated={state.isAuthenticated}>
              <TagPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/top-photos"
          element={
            <ProtectedRoute isAuthenticated={state.isAuthenticated}>
              <TopPhotosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isAuthenticated={state.isAuthenticated}>
              <UserPostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={state.isAuthenticated}>
              <SettingPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;







