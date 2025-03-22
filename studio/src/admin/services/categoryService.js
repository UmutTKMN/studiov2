import api from "./api";

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  getCategory: (identifier) => api.get(`/categories/${identifier}`),
  getCategoryPosts: (identifier) => api.get(`/categories/${identifier}/posts`),
  createCategory: (data) =>
    api.post("/categories", data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  updateCategory: (identifier, data) =>
    api.put(`/categories/${identifier}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  deleteCategory: (identifier) =>
    api.delete(`/categories/${identifier}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
};
