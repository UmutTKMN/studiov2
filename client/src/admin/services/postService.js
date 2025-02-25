import api from './api';

export const postService = {
  // Temel CRUD işlemleri
  getAllPosts: (filters = {}) => api.get("/posts", { params: filters }),
  getPostByIdentifier: (identifier) => api.get(`/posts/${identifier}`),
  createPost: (data) => api.post("/posts", data, {
    headers: {
      'Content-Type': 'multipart/form-data', // Dosya yükleme için
    }
  }),
  updatePost: (identifier, data) => api.put(`/posts/${identifier}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }),
  deletePost: (identifier) => api.delete(`/posts/${identifier}`),

  // Ek özellikler
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getCategoryPosts: (categoryId) => api.get(`/posts/category/${categoryId}`),
  searchPosts: (query) => api.get('/posts/search', { 
    params: { q: query }
  }),
  
  // İstatistikler ve etkileşimler
  incrementViews: (postId) => api.post(`/posts/${postId}/views`),
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
  
  // Meta veriler
  getPostStats: () => api.get('/posts/stats'),
  getRelatedPosts: (postId) => api.get(`/posts/${postId}/related`),

  // Taslak işlemleri
  saveDraft: (data) => api.post('/posts/draft', data),
  getDraft: (draftId) => api.get(`/posts/draft/${draftId}`),
  publishDraft: (draftId) => api.post(`/posts/draft/${draftId}/publish`),
  
  // Arşiv işlemleri
  getArchivedPosts: () => api.get('/posts/archived'),
  archivePost: (postId) => api.post(`/posts/${postId}/archive`),
  restorePost: (postId) => api.post(`/posts/${postId}/restore`),
};