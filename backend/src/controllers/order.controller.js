const OrderService = require("../services/order.service");
const { sendSuccess, sendPaginated } = require("../utils/response.util");

const OrderController = {
  async create(req, res, next) {
    try {
      const order = await OrderService.createOrder(req.user.id, req.body);
      return sendSuccess(res, { order }, "Order created successfully", 201);
    } catch (error) {
      next(error);
    }
  },

  async getMyOrders(req, res, next) {
    try {
      const orders = await OrderService.getUserOrders(req.user.id);
      return sendSuccess(res, { orders }, "Orders fetched");
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const { orders, total } = await OrderService.getAllOrders({ page, limit });
      return sendPaginated(res, orders, total, page, limit, "All orders fetched");
    } catch (error) {
      next(error);
    }
  },

  async getStats(req, res, next) {
    try {
      const stats = await OrderService.getStats();
      return sendSuccess(res, { stats }, "Stats fetched");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = OrderController;
