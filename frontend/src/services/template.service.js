import api from "./api";

export const templateService = {
  getAll: (params) => api.get("/templates", { params }),
  getBySlug: (slug) => api.get(`/templates/${slug}`),
  create: (data) => api.post("/templates", data),
  update: (id, data) => api.put(`/templates/${id}`, data),
  delete: (id) => api.delete(`/templates/${id}`),
};
