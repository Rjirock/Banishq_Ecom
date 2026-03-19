// context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // null = logged out
  const [ready, setReady] = useState(false); // avoid SSR flash

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setReady(true);
  }, []);

  const login = (userData) => {
    const payload = {
      name:   userData.name  || userData.email.split("@")[0],
      email:  userData.email,
      avatar: userData.avatar || null,
    };
    setUser(payload);
    localStorage.setItem("auth_user", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}