import React, { createContext, useState, useEffect } from "react";
import { getItem, setItem, removeItem } from "../utils/storage";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const savedUser = await getItem("user");
    const savedToken = await getItem("token");

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  };

  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    await setItem("user", userData);
    await setItem("token", tokenData);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await removeItem("user");
    await removeItem("token");
  };

  // Merge updates into current user and persist to storage.
  // Use after a successful PUT /auth/me response.
  const updateUser = async (patch) => {
    const next = { ...(user || {}), ...(patch || {}) };
    setUser(next);
    await setItem("user", next);
    return next;
  };

  return (
    <AppContext.Provider value={{
      user, token, cart,
      setCart, login, logout, loading,
      setUser, updateUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};
