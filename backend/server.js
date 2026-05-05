require("dotenv").config();
const app = require("./src/app");
const { testConnection } = require("./src/config/db");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV}`);
      console.log(`🗄️  Database: ${process.env.DB_NAME}\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
