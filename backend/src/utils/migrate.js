require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { pool } = require("../config/db");

const migrate = async () => {
  const connection = await pool.getConnection();

  try {
    console.log("🔄 Running migrations...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        avatar VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✅ users table");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✅ categories table");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,
        description TEXT,
        long_description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        category_id VARCHAR(36),
        preview_url VARCHAR(255),
        thumbnail VARCHAR(255),
        tags JSON,
        tech_stack JSON,
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        download_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      )
    `);
    console.log("  ✅ templates table");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        template_id VARCHAR(36) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'refunded', 'failed') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_reference VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ orders table");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_templates (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        template_id VARCHAR(36) NOT NULL,
        order_id VARCHAR(36),
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_template (user_id, template_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ user_templates table");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        template_id VARCHAR(36) NOT NULL,
        rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_review (user_id, template_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE
      )
    `);
    console.log("  ✅ reviews table");

    console.log("\n✅ All migrations completed successfully!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    throw error;
  } finally {
    connection.release();
    process.exit(0);
  }
};

migrate();
