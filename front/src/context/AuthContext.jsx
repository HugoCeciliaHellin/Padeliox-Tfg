// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  if (savedUser) setUser(savedUser);
}, []);


  const login = ({ token, userId, role, username, email }) => {
    // 1️⃣ save the raw JWT in localStorage
    localStorage.setItem('token', token);

    // 2️⃣ save user profile separately
    const u = { userId, role, username, email };
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
