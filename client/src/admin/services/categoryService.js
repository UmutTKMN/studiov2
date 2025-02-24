import api from './api';

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getCategoryPosts: (slug) => api.get(`/categories/${slug}/posts`),
  createCategory: (data) => api.post("/categories", data, {
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  updateCategory: (slug, data) => api.put(`/categories/${slug}`, data, {
    headers: {
      'Content-Type': 'application/json',
    }
  }),
  deleteCategory: (slug) => api.delete(`/categories/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  }),
};