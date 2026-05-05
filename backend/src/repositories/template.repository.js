const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const TemplateRepository = {
  async findAll({ page = 1, limit = 12, category, search, featured } = {}) {
    const offset = (page - 1) * limit;
    let where = ["t.is_active = 1"];
    const params = [];

    if (category) { where.push("c.slug = ?"); params.push(category); }
    if (search) { where.push("(t.title LIKE ? OR t.description LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }
    if (featured !== undefined) { where.push("t.is_featured = ?"); params.push(featured ? 1 : 0); }

    const whereStr = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const [rows] = await pool.query(
      `SELECT t.*, c.name as category_name, c.slug as category_slug,
       COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(r.id) as review_count
       FROM templates t
       LEFT JOIN categories c ON c.id = t.category_id
       LEFT JOIN reviews r ON r.template_id = t.id
       ${whereStr}
       GROUP BY t.id
       ORDER BY t.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(DISTINCT t.id) as total FROM templates t LEFT JOIN categories c ON c.id = t.category_id ${whereStr}`,
      params
    );
    return { rows, total };
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT t.*, c.name as category_name, c.slug as category_slug,
       COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(r.id) as review_count
       FROM templates t
       LEFT JOIN categories c ON c.id = t.category_id
       LEFT JOIN reviews r ON r.template_id = t.id
       WHERE t.slug = ? AND t.is_active = 1
       GROUP BY t.id`,
      [slug]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM templates WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async create(data) {
    const id = uuidv4();
    const { title, slug, description, long_description, price, category_id, preview_url, thumbnail, tags, tech_stack, is_featured } = data;
    await pool.query(
      `INSERT INTO templates (id, title, slug, description, long_description, price, category_id, preview_url, thumbnail, tags, tech_stack, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, slug, description, long_description, price, category_id, preview_url, thumbnail,
       JSON.stringify(tags || []), JSON.stringify(tech_stack || []), is_featured ? 1 : 0]
    );
    return this.findById(id);
  },

  async update(id, data) {
    const allowed = ["title", "description", "long_description", "price", "category_id", "preview_url", "thumbnail", "tags", "tech_stack", "is_featured", "is_active"];
    const updates = {};
    for (const key of allowed) {
      if (data[key] !== undefined) updates[key] = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
    }
    const fields = Object.keys(updates).map((k) => `${k} = ?`).join(", ");
    const values = [...Object.values(updates), id];
    await pool.query(`UPDATE templates SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.query("UPDATE templates SET is_active = 0 WHERE id = ?", [id]);
  },

  async incrementDownload(id) {
    await pool.query("UPDATE templates SET download_count = download_count + 1 WHERE id = ?", [id]);
  },
};

module.exports = TemplateRepository;
