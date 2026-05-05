const FavouriteService = require("../services/favourite.service");
const { sendSuccess } = require("../utils/response.util");

const FavouriteController = {
  async toggle(req, res, next) {
    try {
      const { templateId } = req.body;
      if (!templateId) {
        return res.status(400).json({ success: false, message: "templateId is required" });
      }
      const result = await FavouriteService.toggle(req.user.id, templateId);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  },

  async getMyFavourites(req, res, next) {
    try {
      const favourites = await FavouriteService.getUserFavourites(req.user.id);
      return sendSuccess(res, { favourites }, "Favourites fetched");
    } catch (error) {
      next(error);
    }
  },

  async getMyFavouriteIds(req, res, next) {
    try {
      const ids = await FavouriteService.getUserFavouriteIds(req.user.id);
      return sendSuccess(res, { ids }, "Favourite IDs fetched");
    } catch (error) {
      next(error);
    }
  },
};

module.exports = FavouriteController;
