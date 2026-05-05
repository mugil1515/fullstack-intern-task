import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/order.service";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(({ data }) => setOrders(data.data?.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard__hero">
        <div className="container">
          <h1>Hey, {user?.name?.split(" ")[0]} 👋</h1>
          <p>Here's your template library and account overview.</p>
        </div>
      </div>

      <div className="container dashboard__body">
        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat">
            <span className="dash-stat__num">{orders.length}</span>
            <span className="dash-stat__label">Templates Owned</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat__num">
              ${orders.reduce((sum, o) => sum + Number(o.amount || 0), 0).toFixed(2)}
            </span>
            <span className="dash-stat__label">Total Spent</span>
          </div>
          <div className="dash-stat">
            <span className="dash-stat__num">{user?.role === "admin" ? "Admin" : "Member"}</span>
            <span className="dash-stat__label">Account Type</span>
          </div>
        </div>

        {/* Templates */}
        <section className="dash-section">
          <div className="dash-section__header">
            <h2>My Templates</h2>
            <Link to="/store" className="btn btn--ghost btn--sm">Browse More</Link>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <div className="dash-empty">
              <p>You haven't purchased any templates yet.</p>
              <Link to="/store" className="btn btn--primary btn--md">Explore Templates →</Link>
            </div>
          ) : (
            <div className="dash-orders">
              {orders.map((order) => (
                <div key={order.id} className="dash-order-item">
                  <div className="dash-order-item__thumb">
                    {order.thumbnail ? (
                      <img src={order.thumbnail} alt={order.template_title} />
                    ) : (
                      <span>⬡</span>
                    )}
                  </div>
                  <div className="dash-order-item__info">
                    <h4>{order.template_title}</h4>
                    <span className="dash-order-item__date">
                      Purchased {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="dash-order-item__actions">
                    <span className="dash-order-item__amount">
                      {Number(order.amount) === 0 ? "Free" : `$${Number(order.amount).toFixed(2)}`}
                    </span>
                    <Link to={`/store/${order.template_slug}`} className="btn btn--ghost btn--sm">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Profile Info */}
        <section className="dash-section">
          <div className="dash-section__header">
            <h2>Account</h2>
          </div>
          <div className="dash-profile">
            <div className="dash-profile__avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="dash-profile__name">{user?.name}</div>
              <div className="dash-profile__email">{user?.email}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
