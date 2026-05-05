const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const OrderRepository = {
  async create({ user_id, template_id, amount, payment_method = "card", payment_reference }) {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO orders (id, user_id, template_id, amount, status, payment_method, payment_reference) VALUES (?, ?, ?, ?, 'completed', ?, ?)",
      [id, user_id, template_id, amount, payment_method, payment_reference || null]
    );
    return this.findById(id);
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT o.*, t.title as template_title, u.name as user_name, u.email as user_email
       FROM orders o JOIN templates t ON t.id = o.template_id JOIN users u ON u.id = o.user_id
       WHERE o.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      `SELECT o.*, t.title as template_title, t.thumbnail, t.slug as template_slug
       FROM orders o JOIN templates t ON t.id = o.template_id
       WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      `SELECT o.*, t.title as template_title, u.name as user_name, u.email as user_email
       FROM orders o JOIN templates t ON t.id = o.template_id JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query("SELECT COUNT(*) as total FROM orders");
    return { rows, total };
  },

  async grantAccess(userId, templateId, orderId) {
    const id = uuidv4();
    await pool.query(
      "INSERT IGNORE INTO user_templates (id, user_id, template_id, order_id) VALUES (?, ?, ?, ?)",
      [id, userId, templateId, orderId]
    );
  },

  async hasAccess(userId, templateId) {
    const [rows] = await pool.query(
      "SELECT id FROM user_templates WHERE user_id = ? AND template_id = ?",
      [userId, templateId]
    );
    return rows.length > 0;
  },

  async getStats() {
    const [[revenue]] = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = 'completed'");
    const [[orders]] = await pool.query("SELECT COUNT(*) as total FROM orders WHERE status = 'completed'");
    const [[users]] = await pool.query("SELECT COUNT(*) as total FROM users");
    const [[templates]] = await pool.query("SELECT COUNT(*) as total FROM templates WHERE is_active = 1");
    return { totalRevenue: revenue.total, totalOrders: orders.total, totalUsers: users.total, totalTemplates: templates.total };
  },
};

module.exports = OrderRepository;
