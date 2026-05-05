import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../../context/FavouriteContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./FavouriteButton.css";

const FavouriteButton = ({ templateId, size = "md" }) => {
  const { isFavourited, toggle } = useFavourites();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const favourited = isFavourited(templateId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const result = await toggle(templateId);
      toast(result?.favourited ? "Added to favourites ♥" : "Removed from favourites");
    } catch {
      toast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`fav-btn fav-btn--${size} ${favourited ? "fav-btn--active" : ""} ${loading ? "fav-btn--loading" : ""}`}
      onClick={handleClick}
      title={favourited ? "Remove from favourites" : "Add to favourites"}
      disabled={loading}
    >
      <svg
        viewBox="0 0 24 24"
        fill={favourited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default FavouriteButton;
