import React, { createContext, useReducer, useContext } from 'react';

const AuthContext = createContext(); // Create a new context

const authReducer = (state, action) => { 
  switch (action.type) {
    case 'SET_AUTHENTICATED': //Set the user as authenticated
      return { ...state, isAuthenticated: true, token: action.payload };
    case 'SET_UNAUTHENTICATED': //Set the user as unauthenticated
      return { ...state, isAuthenticated: false, token: null };
    default:
      return state;
  }
};

//Provides the authetication state to the entire application
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    token: localStorage.getItem('token'),
  });

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Create a custom hook to use the AuthContext
