import api from "./api";

export const orderService = {
  create: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getAll: (params) => api.get("/orders", { params }),
  getStats: () => api.get("/orders/stats"),
};
