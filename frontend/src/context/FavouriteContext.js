import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { favouriteService } from "../services/favourite.service";
import { useAuth } from "./AuthContext";

const FavouriteContext = createContext(null);

export const FavouriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load favourite IDs when user logs in
  useEffect(() => {
    if (user) {
      setLoading(true);
      favouriteService
        .getMyFavouriteIds()
        .then(({ data }) => setFavouriteIds(data.data?.ids || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setFavouriteIds([]);
    }
  }, [user]);

  const isFavourited = useCallback(
    (templateId) => favouriteIds.includes(templateId),
    [favouriteIds]
  );

  const toggle = useCallback(async (templateId) => {
    if (!user) return null;
    try {
      const { data } = await favouriteService.toggle(templateId);
      const wasFavourited = data.data?.favourited;
      setFavouriteIds((prev) =>
        wasFavourited
          ? [...prev, templateId]
          : prev.filter((id) => id !== templateId)
      );
      return data.data;
    } catch (err) {
      throw err;
    }
  }, [user]);

  const count = favouriteIds.length;

  return (
    <FavouriteContext.Provider value={{ favouriteIds, isFavourited, toggle, count, loading }}>
      {children}
    </FavouriteContext.Provider>
  );
};

export const useFavourites = () => {
  const ctx = useContext(FavouriteContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouriteProvider");
  return ctx;
};
