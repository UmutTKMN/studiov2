import api from './api';

export const postService = {
  getAllPosts: () => api.get("/posts"),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  createPost: (data) => api.post("/posts", data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
}; 