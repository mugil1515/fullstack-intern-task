import React, { useEffect, useState } from "react";
import { orderService } from "../../services/order.service";
import { templateService } from "../../services/template.service";
import { useToast } from "../../context/ToastContext";
import "./Admin.css";

const Admin = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [newTemplate, setNewTemplate] = useState({ title: "", description: "", price: "", preview_url: "", thumbnail: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      orderService.getStats(),
      orderService.getAll({ limit: 20 }),
    ]).then(([statsRes, ordersRes]) => {
      setStats(statsRes.data.data?.stats);
      setOrders(ordersRes.data.data || []);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await templateService.create({ ...newTemplate, price: parseFloat(newTemplate.price) || 0 });
      toast("Template created successfully! 🎉");
      setNewTemplate({ title: "", description: "", price: "", preview_url: "", thumbnail: "" });
    } catch (err) {
      toast(err.response?.data?.message || "Failed to create template", "error");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="container">
          <h1>Admin Panel</h1>
          <div className="admin__tabs">
            {["overview", "orders", "templates"].map((t) => (
              <button key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container admin__body">
        {/* Overview Tab */}
        {tab === "overview" && stats && (
          <div className="admin-stats">
            {[
              { label: "Total Revenue", value: `$${Number(stats.totalRevenue || 0).toFixed(2)}`, icon: "💰" },
              { label: "Total Orders", value: stats.totalOrders, icon: "📦" },
              { label: "Total Users", value: stats.totalUsers, icon: "👥" },
              { label: "Templates", value: stats.totalTemplates, icon: "🗂️" },
            ].map((s) => (
              <div key={s.label} className="admin-stat">
                <span className="admin-stat__icon">{s.icon}</span>
                <span className="admin-stat__val">{s.value}</span>
                <span className="admin-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="admin-table-wrap">
            <h2>Recent Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Template</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.user_name}<br /><small>{o.user_email}</small></td>
                    <td>{o.template_title}</td>
                    <td>{Number(o.amount) === 0 ? "Free" : `$${Number(o.amount).toFixed(2)}`}</td>
                    <td><span className={`status-badge status--${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Templates Tab */}
        {tab === "templates" && (
          <div className="admin-create">
            <h2>Create New Template</h2>
            <form className="admin-form" onSubmit={handleCreateTemplate}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title *</label>
                  <input type="text" placeholder="e.g. SaaS Dashboard Starter" value={newTemplate.title}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input type="number" placeholder="0 for free" min="0" step="0.01" value={newTemplate.price}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, price: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" placeholder="Brief description of the template..." value={newTemplate.description}
                  onChange={(e) => setNewTemplate((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preview URL</label>
                  <input type="url" placeholder="https://..." value={newTemplate.preview_url}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, preview_url: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Thumbnail URL</label>
                  <input type="url" placeholder="https://..." value={newTemplate.thumbnail}
                    onChange={(e) => setNewTemplate((p) => ({ ...p, thumbnail: e.target.value }))} />
                </div>
              </div>
              <button type="submit" className="btn btn--primary btn--md" disabled={creating}>
                {creating ? "Creating..." : "Create Template"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
