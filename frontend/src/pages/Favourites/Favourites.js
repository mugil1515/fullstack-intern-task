import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { favouriteService } from "../../services/favourite.service";
import { useFavourites } from "../../context/FavouriteContext";
import FavouriteButton from "../../components/ui/FavouriteButton";
import "./Favourites.css";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { count } = useFavourites();

  const fetchFavourites = () => {
    setLoading(true);
    favouriteService
      .getMyFavourites()
      .then(({ data }) => setFavourites(data.data?.favourites || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavourites();
  }, [count]); // re-fetch when count changes (item removed)

  const techStack = (t) =>
    typeof t.tech_stack === "string"
      ? JSON.parse(t.tech_stack || "[]")
      : t.tech_stack || [];

  return (
    <div className="favourites-page">
      <div className="favourites-page__header">
        <div className="container">
          <div className="favourites-page__title-row">
            <div>
              <h1>
                <span className="fav-heart">♥</span> My Favourites
              </h1>
              <p>{favourites.length} template{favourites.length !== 1 ? "s" : ""} saved</p>
            </div>
            <Link to="/store" className="btn btn--ghost btn--sm">
              Browse More →
            </Link>
          </div>
        </div>
      </div>

      <div className="container favourites-page__body">
        {loading ? (
          <div className="spinner" />
        ) : favourites.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-empty__icon">♡</div>
            <h2>No favourites yet</h2>
            <p>Click the heart icon on any template to save it here.</p>
            <Link to="/store" className="btn btn--primary btn--md">
              Explore Templates
            </Link>
          </div>
        ) : (
          <div className="fav-list">
            {favourites.map((template) => {
              const stack = techStack(template);
              const isFree =
                template.price === 0 || template.price === "0.00";

              return (
                <div key={template.id} className="fav-item">
                  {/* Thumbnail */}
                  <Link to={`/store/${template.slug}`} className="fav-item__thumb">
                    {template.thumbnail ? (
                      <img src={template.thumbnail} alt={template.title} />
                    ) : (
                      <div className="fav-item__thumb-placeholder">⬡</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="fav-item__info">
                    {template.category_name && (
                      <span className="fav-item__cat">{template.category_name}</span>
                    )}
                    <Link to={`/store/${template.slug}`} className="fav-item__title">
                      {template.title}
                    </Link>
                    <p className="fav-item__desc">{template.description}</p>
                    {stack.length > 0 && (
                      <div className="fav-item__tags">
                        {stack.slice(0, 4).map((t) => (
                          <span key={t} className="tag">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="fav-item__meta">
                      <span className="star">★</span>
                      <span>{Number(template.avg_rating || 0).toFixed(1)}</span>
                      <span className="fav-item__sep">·</span>
                      <span>{template.review_count || 0} reviews</span>
                    </div>
                  </div>

                  {/* Right: price + actions */}
                  <div className="fav-item__actions">
                    <span className="fav-item__price">
                      {isFree ? (
                        <span className="price--free">Free</span>
                      ) : (
                        `$${Number(template.price).toFixed(2)}`
                      )}
                    </span>
                    <Link
                      to={`/store/${template.slug}`}
                      className="btn btn--primary btn--sm"
                    >
                      {isFree ? "Get Free" : "Buy Now"}
                    </Link>
                    <FavouriteButton templateId={template.id} size="md" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
