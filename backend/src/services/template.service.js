const TemplateRepository = require("../repositories/template.repository");
const OrderRepository = require("../repositories/order.repository");

const TemplateService = {
  async getAll(query) {
    const { rows, total } = await TemplateRepository.findAll(query);
    return { templates: rows, total };
  },

  async getBySlug(slug, userId = null) {
    const template = await TemplateRepository.findBySlug(slug);
    if (!template) {
      const err = new Error("Template not found.");
      err.statusCode = 404;
      throw err;
    }

    let hasAccess = false;
    if (userId) {
      hasAccess = template.price === 0 || await OrderRepository.hasAccess(userId, template.id);
    }

    return { ...template, hasAccess };
  },

  async create(data) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return TemplateRepository.create({ ...data, slug });
  },

  async update(id, data) {
    const template = await TemplateRepository.findById(id);
    if (!template) {
      const err = new Error("Template not found.");
      err.statusCode = 404;
      throw err;
    }
    return TemplateRepository.update(id, data);
  },

  async delete(id) {
    const template = await TemplateRepository.findById(id);
    if (!template) {
      const err = new Error("Template not found.");
      err.statusCode = 404;
      throw err;
    }
    await TemplateRepository.delete(id);
  },
};

module.exports = TemplateService;
