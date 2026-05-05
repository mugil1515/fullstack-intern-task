import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <span className="footer__logo">⬡ TemplateHub</span>
        <p>Premium SaaS templates for modern builders.</p>
      </div>
      <div className="footer__links">
        <div className="footer__col">
          <h4>Product</h4>
          <Link to="/store">Browse Templates</Link>
          <Link to="/store?featured=true">Featured</Link>
        </div>
        <div className="footer__col">
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Sign Up</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <p>© {new Date().getFullYear()} TemplateHub. Built with Node.js & React.</p>
    </div>
  </footer>
);

export default Footer;
