const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const UserRepository = {
  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  },

  async create({ name, email, password, role = "user" }) {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, password, role]
    );
    return this.findById(id);
  },

  async update(id, updates) {
    const fields = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), id];
    await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  },

  async findAll({ page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT id, name, email, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query("SELECT COUNT(*) as total FROM users");
    return { rows, total };
  },

  async getPurchasedTemplates(userId) {
    const [rows] = await pool.query(
      `SELECT t.*, ut.purchased_at FROM user_templates ut
       JOIN templates t ON t.id = ut.template_id
       WHERE ut.user_id = ? ORDER BY ut.purchased_at DESC`,
      [userId]
    );
    return rows;
  },
};

module.exports = UserRepository;
