const { verifyToken } = require("../utils/jwt.util");
const { sendError } = require("../utils/response.util");
const UserRepository = require("../repositories/user.repository");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, "Access denied. No token provided.", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await UserRepository.findById(decoded.id);
    if (!user || !user.is_active) {
      return sendError(res, "User not found or deactivated.", 401);
    }

    req.user = { id: user.id, email: user.email, role: user.role, name: user.name };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, "Token expired. Please login again.", 401);
    }
    return sendError(res, "Invalid token.", 401);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, "Access denied. Insufficient permissions.", 403);
    }
    next();
  };
};

module.exports = { authenticate, authorize };
