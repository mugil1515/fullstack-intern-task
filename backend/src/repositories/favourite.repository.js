const { pool } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const FavouriteRepository = {
  async add(userId, templateId) {
    const id = uuidv4();
    await pool.query(
      "INSERT IGNORE INTO favourites (id, user_id, template_id) VALUES (?, ?, ?)",
      [id, userId, templateId]
    );
  },

  async remove(userId, templateId) {
    await pool.query(
      "DELETE FROM favourites WHERE user_id = ? AND template_id = ?",
      [userId, templateId]
    );
  },

  async isFavourited(userId, templateId) {
    const [rows] = await pool.query(
      "SELECT id FROM favourites WHERE user_id = ? AND template_id = ?",
      [userId, templateId]
    );
    return rows.length > 0;
  },

  async getUserFavourites(userId) {
    const [rows] = await pool.query(
      `SELECT t.*, c.name as category_name, c.slug as category_slug,
       COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(r.id) as review_count,
       f.created_at as favourited_at
       FROM favourites f
       JOIN templates t ON t.id = f.template_id
       LEFT JOIN categories c ON c.id = t.category_id
       LEFT JOIN reviews r ON r.template_id = t.id
       WHERE f.user_id = ? AND t.is_active = 1
       GROUP BY t.id, f.created_at
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async getUserFavouriteIds(userId) {
    const [rows] = await pool.query(
      "SELECT template_id FROM favourites WHERE user_id = ?",
      [userId]
    );
    return rows.map((r) => r.template_id);
  },
};

module.exports = FavouriteRepository;
