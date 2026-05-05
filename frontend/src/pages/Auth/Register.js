import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Auth.css";

const Register = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form);
      toast("Account created! Welcome to TemplateHub 🎉");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">⬡ TemplateHub</Link>
          <h1>Create your account</h1>
          <p>Start building faster today</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn--primary btn--md auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
