import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { templateService } from "../../services/template.service";
import { orderService } from "../../services/order.service";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./TemplateDetail.css";

const TemplateDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    templateService.getBySlug(slug)
      .then(({ data }) => setTemplate(data.data.template))
      .catch(() => navigate("/store"))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handlePurchase = async () => {
    if (!user) { navigate("/login"); return; }
    setPurchasing(true);
    try {
      await orderService.create({ templateId: template.id });
      toast("Template purchased successfully! 🎉");
      setTemplate((prev) => ({ ...prev, hasAccess: true }));
    } catch (err) {
      toast(err.response?.data?.message || "Purchase failed", "error");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (!template) return null;

  const techStack = typeof template.tech_stack === "string"
    ? JSON.parse(template.tech_stack || "[]")
    : (template.tech_stack || []);

  const tags = typeof template.tags === "string"
    ? JSON.parse(template.tags || "[]")
    : (template.tags || []);

  const isFree = template.price === 0 || template.price === "0.00";

  return (
    <div className="detail">
      <div className="container detail__inner">
        {/* Left Column */}
        <div className="detail__main">
          <Link to="/store" className="detail__back">← Back to Store</Link>
          {template.category_name && <span className="detail__cat">{template.category_name}</span>}
          <h1 className="detail__title">{template.title}</h1>
          <div className="detail__meta">
            <span className="star">★</span>
            <span>{Number(template.avg_rating || 0).toFixed(1)}</span>
            <span className="meta-sep">·</span>
            <span>{template.review_count || 0} reviews</span>
            <span className="meta-sep">·</span>
            <span>{template.download_count || 0} downloads</span>
          </div>

          <div className="detail__thumb">
            {template.thumbnail ? (
              <img src={template.thumbnail} alt={template.title} />
            ) : (
              <div className="detail__thumb-placeholder"><span>⬡</span></div>
            )}
          </div>

          <div className="detail__description">
            <h2>About this template</h2>
            <p>{template.long_description || template.description}</p>
          </div>

          {techStack.length > 0 && (
            <div className="detail__section">
              <h3>Tech Stack</h3>
              <div className="detail__tags">
                {techStack.map((t) => <span key={t} className="tag tag--lg">{t}</span>)}
              </div>
            </div>
          )}

          {tags.length > 0 && (
            <div className="detail__section">
              <h3>Tags</h3>
              <div className="detail__tags">
                {tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail__sidebar">
          <div className="purchase-card">
            <div className="purchase-card__price">
              {isFree ? <span className="price--free">Free</span> : `$${Number(template.price).toFixed(2)}`}
            </div>

            {template.hasAccess ? (
              <div className="purchase-card__owned">
                <span className="owned-badge">✓ You own this</span>
                {template.preview_url && (
                  <a href={template.preview_url} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--md" style={{ width: "100%", justifyContent: "center" }}>
                    Download / Preview
                  </a>
                )}
              </div>
            ) : (
              <button
                className="btn btn--primary btn--md"
                style={{ width: "100%" }}
                onClick={handlePurchase}
                disabled={purchasing}
              >
                {purchasing ? "Processing..." : isFree ? "Get for Free" : `Buy — $${Number(template.price).toFixed(2)}`}
              </button>
            )}

            {template.preview_url && !template.hasAccess && (
              <a href={template.preview_url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--md" style={{ width: "100%", marginTop: 8, justifyContent: "center" }}>
                Live Preview →
              </a>
            )}

            <ul className="purchase-card__perks">
              <li>✓ Lifetime access</li>
              <li>✓ Free updates</li>
              <li>✓ Commercial license</li>
              <li>✓ Full source code</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TemplateDetail;
