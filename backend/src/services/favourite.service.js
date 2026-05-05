const FavouriteRepository = require("../repositories/favourite.repository");

const FavouriteService = {
  async toggle(userId, templateId) {
    const already = await FavouriteRepository.isFavourited(userId, templateId);
    if (already) {
      await FavouriteRepository.remove(userId, templateId);
      return { favourited: false, message: "Removed from favourites" };
    } else {
      await FavouriteRepository.add(userId, templateId);
      return { favourited: true, message: "Added to favourites" };
    }
  },

  async getUserFavourites(userId) {
    return FavouriteRepository.getUserFavourites(userId);
  },

  async getUserFavouriteIds(userId) {
    return FavouriteRepository.getUserFavouriteIds(userId);
  },

  async isFavourited(userId, templateId) {
    return FavouriteRepository.isFavourited(userId, templateId);
  },
};

module.exports = FavouriteService;
