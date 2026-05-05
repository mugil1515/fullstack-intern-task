import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouriteContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useFavourites();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⬡</span>
          TemplateHub
        </Link>

        <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/store" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Store</NavLink>
          {user && <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Admin</NavLink>}
        </div>

        <div className="navbar__actions">
          {user && (
            <NavLink
              to="/favourites"
              className={({ isActive }) => `navbar__fav-btn ${isActive ? "active" : ""}`}
              title="My Favourites"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {count > 0 && <span className="navbar__fav-count">{count}</span>}
            </NavLink>
          )}

          {user ? (
            <div className="navbar__user">
              <span className="navbar__username">{user.name.split(" ")[0]}</span>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
            </>
          )}
        </div>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
