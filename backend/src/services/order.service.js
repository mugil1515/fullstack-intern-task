const OrderRepository = require("../repositories/order.repository");
const TemplateRepository = require("../repositories/template.repository");

const OrderService = {
  async createOrder(userId, { templateId }) {
    const template = await TemplateRepository.findById(templateId);
    if (!template || !template.is_active) {
      const err = new Error("Template not found.");
      err.statusCode = 404;
      throw err;
    }

    const alreadyOwned = await OrderRepository.hasAccess(userId, templateId);
    if (alreadyOwned) {
      const err = new Error("You already own this template.");
      err.statusCode = 409;
      throw err;
    }

    // For free templates, grant access directly
    if (template.price === 0) {
      const order = await OrderRepository.create({
        user_id: userId, template_id: templateId, amount: 0, payment_method: "free"
      });
      await OrderRepository.grantAccess(userId, templateId, order.id);
      await TemplateRepository.incrementDownload(templateId);
      return order;
    }

    // Paid templates — payment integration point
    const order = await OrderRepository.create({
      user_id: userId, template_id: templateId, amount: template.price, payment_method: "card"
    });
    await OrderRepository.grantAccess(userId, templateId, order.id);
    await TemplateRepository.incrementDownload(templateId);
    return order;
  },

  async getUserOrders(userId) {
    return OrderRepository.findByUser(userId);
  },

  async getAllOrders(query) {
    const { rows, total } = await OrderRepository.findAll(query);
    return { orders: rows, total };
  },

  async getStats() {
    return OrderRepository.getStats();
  },
};

module.exports = OrderService;
