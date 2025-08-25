// src/context/AuthContext.js
import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; 
import { AuthContext } from "./auth"; 
import { jwtDecode } from "jwt-decode";

export const AuthProvider = ({ children }) => {
  // const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); 
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token is valid (not expired)
  const checkToken = () => {
    const token = localStorage.getItem("access_token");
    const storedRole = localStorage.getItem("role");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        setUser(null);
        setRole(null);
        return false;
      }

      setUser(decoded); 
      setRole(storedRole || decoded.role || null);
      return true;
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      setUser(null);
      setRole(null);
      return false;
    }
  };

  // Run on mount
  useEffect(() => {
    setIsLoggedIn(checkToken());
    setLoading(false);
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem("access_token", token);

    if(userRole) {
      localStorage.setItem("role", userRole);
      setRole(userRole);
    }else {
      // If role comes from token payload
      const decoded = jwtDecode(token);
      if (decoded.role) {
        localStorage.setItem("role", decoded.role);
        setRole(decoded.role);
      }
    }
    setIsLoggedIn(true);
    setUser(jwtDecode(token)); 
    // navigate("/home");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    // navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, role, login, logout, loading }}>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
