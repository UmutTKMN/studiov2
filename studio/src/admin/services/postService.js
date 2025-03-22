import api from "./api";

export const postService = {
  getAllPosts: (options = {}) => {
    const { page, limit, search, status, startDate, endDate, sortBy, sortDir } =
      options;

      console.log("options", options);

    return api.get("/posts", {
      params: {
        page,
        limit,
        search,
        status,
        startDate,
        endDate,
        sortBy,
        sortDir,
      },
    });
  },

  // Tekil post getirme
  getPost: (identifier) => api.get(`/posts/${identifier}`),

  // CRUD işlemleri
  createPost: (data) => api.post("/posts", data),
  updatePost: (identifier, data) => api.put(`/posts/${identifier}`, data),
  deletePost: (identifier) => api.delete(`/posts/${identifier}`),

  // Kolaylık fonksiyonları - Aslında hepsi getAllPosts ile yapılabilir
  getUserPosts: (userId, options = {}) =>
    postService.getAllPosts({ ...options, author: userId }),

  getCategoryPosts: (categoryId, options = {}) =>
    postService.getAllPosts({ ...options, category: categoryId }),

  searchPosts: (query, options = {}) =>
    postService.getAllPosts({ ...options, search: query }),
};
