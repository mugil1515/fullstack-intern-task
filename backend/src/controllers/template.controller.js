const TemplateService = require("../services/template.service");
const { sendSuccess, sendPaginated } = require("../utils/response.util");

const TemplateController = {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 12, category, search, featured } = req.query;
      const { templates, total } = await TemplateService.getAll({ page, limit, category, search, featured });
      return sendPaginated(res, templates, total, page, limit, "Templates fetched");
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req, res, next) {
    try {
      const userId = req.user?.id || null;
      const template = await TemplateService.getBySlug(req.params.slug, userId);
      return sendSuccess(res, { template }, "Template fetched");
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const template = await TemplateService.create(req.body);
      return sendSuccess(res, { template }, "Template created", 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const template = await TemplateService.update(req.params.id, req.body);
      return sendSuccess(res, { template }, "Template updated");
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await TemplateService.delete(req.params.id);
      return sendSuccess(res, {}, "Template deleted");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = TemplateController;
