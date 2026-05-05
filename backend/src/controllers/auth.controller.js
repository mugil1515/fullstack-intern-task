const AuthService = require("../services/auth.service");
const { sendSuccess, sendError } = require("../utils/response.util");

const AuthController = {
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, "Registration successful", 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      return sendSuccess(res, { user }, "Profile fetched");
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res) {
    // Stateless JWT — client discards token
    return sendSuccess(res, {}, "Logged out successfully");
  },
};

module.exports = AuthController;
