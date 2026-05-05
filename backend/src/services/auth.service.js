const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/user.repository");
const { generateToken } = require("../utils/jwt.util");

const AuthService = {
  async register({ name, email, password }) {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      const err = new Error("Email already registered.");
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await UserRepository.create({ name, email, password: hashedPassword });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      throw err;
    }

    if (!user.is_active) {
      const err = new Error("Account is deactivated. Please contact support.");
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
  },

  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      const err = new Error("User not found.");
      err.statusCode = 404;
      throw err;
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  },
};

module.exports = AuthService;
