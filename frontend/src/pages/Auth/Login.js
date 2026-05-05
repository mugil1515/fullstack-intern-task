import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      toast("Welcome back! 👋");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-card__header">
          <Link to="/" className="auth-logo">⬡ TemplateHub</Link>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" type="email" name="email"
              placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              required autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" type="password" name="password"
              placeholder="••••••••"
              value={form.password} onChange={handleChange}
              required autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn--primary btn--md auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
