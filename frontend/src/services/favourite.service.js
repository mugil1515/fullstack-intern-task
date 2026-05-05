import api from "./api";

export const favouriteService = {
  toggle: (templateId) => api.post("/favourites/toggle", { templateId }),
  getMyFavourites: () => api.get("/favourites"),
  getMyFavouriteIds: () => api.get("/favourites/ids"),
};
