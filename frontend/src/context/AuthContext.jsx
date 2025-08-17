// src/context/AuthContext.js
import React, { useState, useEffect } from 'react';
import { AuthContext } from './auth'; 
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return Date.now() < exp * 1000;
    } catch (e) {
      return false;
    }
  });

  const login = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};