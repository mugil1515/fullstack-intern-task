import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { templateService } from "../../services/template.service";
import TemplateCard from "../../components/ui/TemplateCard";
import "./Home.css";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    templateService.getAll({ featured: true, limit: 3 })
      .then(({ data }) => setFeatured(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="container hero__content fade-up">
          <span className="hero__eyebrow">🚀 Premium SaaS Starter Kits</span>
          <h1 className="hero__title">
            Launch your SaaS<br />
            <span className="hero__accent">10× faster</span>
          </h1>
          <p className="hero__subtitle">
            Production-ready templates with auth, payments, dashboards, and more.
            Stop building from scratch — ship what matters.
          </p>
          <div className="hero__ctas">
            <Link to="/store" className="btn btn--primary btn--lg">Browse Templates</Link>
            <Link to="/register" className="btn btn--ghost btn--lg">Start Free →</Link>
          </div>
          <div className="hero__stats">
            <div className="stat"><strong>50+</strong><span>Templates</span></div>
            <div className="stat__divider" />
            <div className="stat"><strong>2k+</strong><span>Developers</span></div>
            <div className="stat__divider" />
            <div className="stat"><strong>4.9★</strong><span>Avg Rating</span></div>
          </div>
        </div>
      </section>

      {/* Featured Templates */}
      <section className="section">
        <div className="container">
          <div className="section__header">
            <h2>Featured Templates</h2>
            <Link to="/store" className="section__link">View all →</Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : featured.length > 0 ? (
            <div className="template-grid">
              {featured.map((t) => <TemplateCard key={t.id} template={t} />)}
            </div>
          ) : (
            <p className="empty-state">No templates yet — check back soon!</p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section section--alt">
        <div className="container">
          <div className="section__header center">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            {[
              { icon: "🔍", title: "Browse", desc: "Find the perfect template for your SaaS idea" },
              { icon: "💳", title: "Purchase", desc: "One-time payment, lifetime access and updates" },
              { icon: "🚀", title: "Launch", desc: "Deploy in minutes, not weeks" },
            ].map((step) => (
              <div key={step.title} className="step">
                <span className="step__icon">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-banner__inner">
          <h2>Ready to ship faster?</h2>
          <p>Join thousands of builders using TemplateHub.</p>
          <Link to="/register" className="btn btn--primary btn--lg">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
