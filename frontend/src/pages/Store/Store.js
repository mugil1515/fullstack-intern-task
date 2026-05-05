import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { templateService } from "../../services/template.service";
import TemplateCard from "../../components/ui/TemplateCard";
import "./Store.css";

const CATEGORIES = ["All", "Dashboard", "Landing Page", "SaaS", "E-Commerce", "Blog", "Admin Panel"];

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const featured = searchParams.get("featured") || "";

  const fetchTemplates = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.search = search;
    if (category && category !== "All") params.category = category.toLowerCase().replace(/ /g, "-");
    if (featured) params.featured = featured;

    templateService.getAll(params)
      .then(({ data }) => {
        setTemplates(data.data || []);
        setTotal(data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, category, featured]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const handleSearch = (e) => {
    setSearchParams((prev) => { prev.set("search", e.target.value); return prev; });
    setPage(1);
  };

  const handleCategory = (cat) => {
    setSearchParams((prev) => {
      if (cat === "All") prev.delete("category"); else prev.set("category", cat);
      return prev;
    });
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="store">
      <div className="store__header">
        <div className="container">
          <h1>Template Store</h1>
          <p>Find the perfect starting point for your next project</p>
          <div className="store__search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="container store__body">
        <div className="store__filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${(category === cat || (!category && cat === "All")) ? "active" : ""}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="store__meta">
          <span className="store__count">{total} templates found</span>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : templates.length > 0 ? (
          <>
            <div className="template-grid">
              {templates.map((t) => <TemplateCard key={t.id} template={t} />)}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <span className="page-info">{page} / {totalPages}</span>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No templates found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
