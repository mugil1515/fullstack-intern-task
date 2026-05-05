const bcrypt = require("bcryptjs");
const UserRepository = require("../repositories/user.repository");
const OrderRepository = require("../repositories/order.repository");
const { sendSuccess, sendPaginated } = require("../utils/response.util");

const UserController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { rows, total } = await UserRepository.findAll({ page, limit });
      return sendPaginated(res, rows, total, page, limit, "Users fetched");
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const { name, avatar } = req.body;
      const updates = {};
      if (name) updates.name = name;
      if (avatar) updates.avatar = avatar;
      const user = await UserRepository.update(req.user.id, updates);
      const { password: _, ...safeUser } = user;
      return sendSuccess(res, { user: safeUser }, "Profile updated");
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await UserRepository.findById(req.user.id);
      const bcrypt = require("bcryptjs");
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Current password is incorrect." });
      }
      const hashed = await bcrypt.hash(newPassword, 12);
      await UserRepository.update(req.user.id, { password: hashed });
      return sendSuccess(res, {}, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  },

  async getMyTemplates(req, res, next) {
    try {
      const templates = await UserRepository.getPurchasedTemplates(req.user.id);
      return sendSuccess(res, { templates }, "Purchased templates fetched");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
