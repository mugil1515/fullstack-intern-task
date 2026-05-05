import React from "react";
import { Link } from "react-router-dom";
import FavouriteButton from "./FavouriteButton";
import "./TemplateCard.css";

const TemplateCard = ({ template }) => {
  const { id, title, slug, description, price, thumbnail, category_name, avg_rating, review_count, tech_stack, is_featured } = template;

  const techStack = typeof tech_stack === "string" ? JSON.parse(tech_stack || "[]") : (tech_stack || []);

  return (
    <div className="template-card-wrapper">
      <Link to={`/store/${slug}`} className="template-card">
        {is_featured && <span className="template-card__badge">Featured</span>}

        {/* Favourite Button overlaid on card */}
        <div className="template-card__fav" onClick={(e) => e.preventDefault()}>
          <FavouriteButton templateId={id} size="sm" />
        </div>

        <div className="template-card__thumb">
          {thumbnail ? (
            <img src={thumbnail} alt={title} loading="lazy" />
          ) : (
            <div className="template-card__placeholder">
              <span>⬡</span>
            </div>
          )}
        </div>
        <div className="template-card__body">
          {category_name && <span className="template-card__cat">{category_name}</span>}
          <h3 className="template-card__title">{title}</h3>
          <p className="template-card__desc">{description}</p>

          {techStack.length > 0 && (
            <div className="template-card__tags">
              {techStack.slice(0, 3).map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          )}

          <div className="template-card__footer">
            <div className="template-card__rating">
              <span className="star">★</span>
              <span>{Number(avg_rating || 0).toFixed(1)}</span>
              <span className="template-card__reviews">({review_count || 0})</span>
            </div>
            <span className="template-card__price">
              {price === 0 || price === "0.00" ? (
                <span className="price--free">Free</span>
              ) : (
                `$${Number(price).toFixed(2)}`
              )}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TemplateCard;
