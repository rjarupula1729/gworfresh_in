import React, { createContext, useState, useEffect } from "react";
import { getItem, setItem, removeItem } from "../utils/storage";

export const AppContext = createContext();

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

const DEFAULT_DAY = { breaks: [false, false, false, false, false], breathing: false, hourForYou: false };

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [futurePlants, setFuturePlants] = useState([]);
  const [growPoints, setGrowPoints] = useState(0);
  const [communities, setCommunities] = useState([]); // joined community ids
  const [wellnessByDay, setWellnessByDay] = useState({}); // { 'YYYY-MM-DD': DEFAULT_DAY }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    const savedUser = await getItem("user");
    const savedToken = await getItem("token");
    const savedWish = await getItem("wishlist");
    const savedFuture = await getItem("futurePlants");
    const savedPts = await getItem("growPoints");
    const savedComm = await getItem("communities");
    const savedWell = await getItem("wellnessByDay");
    if (savedUser && savedToken) { setUser(savedUser); setToken(savedToken); }
    if (Array.isArray(savedWish)) setWishlist(savedWish);
    if (Array.isArray(savedFuture)) setFuturePlants(savedFuture);
    if (typeof savedPts === "number") setGrowPoints(savedPts);
    if (Array.isArray(savedComm)) setCommunities(savedComm);
    if (savedWell && typeof savedWell === "object") setWellnessByDay(savedWell);
    setLoading(false);
  };

  const login = async (userData, tokenData) => {
    setUser(userData); setToken(tokenData);
    await setItem("user", userData); await setItem("token", tokenData);
  };

  const logout = async () => {
    setUser(null); setToken(null);
    await removeItem("user"); await removeItem("token");
  };

  const updateUser = async (patch) => {
    const next = { ...(user || {}), ...(patch || {}) };
    setUser(next); await setItem("user", next); return next;
  };

  // Wishlist
  const isWished = (productId) => wishlist.includes(productId);
  const toggleWishlist = async (productId) => {
    if (!productId) return;
    const next = wishlist.includes(productId) ? wishlist.filter((id) => id !== productId) : [...wishlist, productId];
    setWishlist(next); await setItem("wishlist", next);
  };
  const removeFromWishlist = async (productId) => {
    const next = wishlist.filter((id) => id !== productId);
    setWishlist(next); await setItem("wishlist", next);
  };
  const clearWishlist = async () => { setWishlist([]); await setItem("wishlist", []); };

  // Future plants
  const addFuturePlant = async (plant) => {
    const entry = {
      id: plant.id || ("fp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6)),
      name: plant.name || "Untitled plant",
      emoji: plant.emoji || "S",
      note: plant.note || "",
      plannedFor: plant.plannedFor || "",
      addedAt: new Date().toISOString(),
    };
    const next = [entry, ...futurePlants];
    setFuturePlants(next); await setItem("futurePlants", next); return entry;
  };
  const removeFuturePlant = async (id) => {
    const next = futurePlants.filter((p) => p.id !== id);
    setFuturePlants(next); await setItem("futurePlants", next);
  };
  const clearFuturePlants = async () => { setFuturePlants([]); await setItem("futurePlants", []); };

  // GrowPoints
  const addPoints = async (n) => {
    const next = Math.max(0, growPoints + (Number(n) || 0));
    setGrowPoints(next); await setItem("growPoints", next); return next;
  };
  const resetPoints = async () => { setGrowPoints(0); await setItem("growPoints", 0); };

  // Communities
  const isJoined = (id) => communities.includes(id);
  const toggleCommunity = async (id) => {
    if (!id) return;
    const next = communities.includes(id) ? communities.filter((x) => x !== id) : [...communities, id];
    setCommunities(next); await setItem("communities", next);
  };

  // Wellness / WFH
  const todayWellness = () => wellnessByDay[todayKey()] || DEFAULT_DAY;

  const updateTodayWellness = async (patch) => {
    const key = todayKey();
    const cur = wellnessByDay[key] || DEFAULT_DAY;
    const merged = { ...cur, ...patch };
    const nextMap = { ...wellnessByDay, [key]: merged };
    setWellnessByDay(nextMap);
    await setItem("wellnessByDay", nextMap);
    return merged;
  };

  const toggleBreak = async (idx) => {
    const cur = todayWellness();
    const nextBreaks = cur.breaks.slice();
    nextBreaks[idx] = !nextBreaks[idx];
    const merged = await updateTodayWellness({ breaks: nextBreaks });
    // Award 5 points per completed break
    if (nextBreaks[idx]) await addPoints(5);
    return merged;
  };

  const markBreathing = async () => {
    const cur = todayWellness();
    if (cur.breathing) return cur;
    const merged = await updateTodayWellness({ breathing: true });
    await addPoints(10);
    return merged;
  };

  const markHourForYou = async () => {
    const cur = todayWellness();
    if (cur.hourForYou) return cur;
    const merged = await updateTodayWellness({ hourForYou: true });
    await addPoints(25);
    return merged;
  };

  return (
    <AppContext.Provider value={{
      user, token, cart, wishlist, futurePlants, growPoints, communities, wellnessByDay,
      setCart, setUser, setWishlist,
      login, logout, updateUser, loading,
      isWished, toggleWishlist, removeFromWishlist, clearWishlist,
      addFuturePlant, removeFuturePlant, clearFuturePlants,
      addPoints, resetPoints,
      isJoined, toggleCommunity,
      todayWellness, updateTodayWellness, toggleBreak, markBreathing, markHourForYou,
    }}>
      {children}
    </AppContext.Provider>
  );
};
