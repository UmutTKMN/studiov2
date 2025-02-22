import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Doğru kullanım
});

// Request interceptor'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor'ı ekle
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const postService = {
  getAllPosts: () => api.get("/posts"),
  getPostBySlug: (slug) => api.get(`/posts/${slug}`),
  createPost: (data) => api.post("/posts", data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getCategoryPosts: (slug) => api.get(`/categories/${slug}/posts`),
  createCategory: (data) => api.post("/categories", data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const projectService = {
  getAllProjects: () => api.get("/projects"),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const activityLogService = {
  getUserActivity: (userId) => api.get(`/activity-logs/user/${userId}`),
  getTableActivity: (tableName) => api.get(`/activity-logs/table/${tableName}`),
  getRecentActivity: (page = 1, limit = 20, filters = {}) => {
    // Filtreleri URL parametrelerine dönüştür
    const queryParams = new URLSearchParams();

    // Temel parametreler
    queryParams.append("page", page);
    queryParams.append("limit", limit);

    // Filtre parametreleri
    if (filters.action) {
      queryParams.append("action", filters.action);
    }
    if (filters.table) {
      queryParams.append("table", filters.table);
    }
    if (filters.sortBy) {
      queryParams.append("sortBy", filters.sortBy);
    }
    if (filters.search) {
      queryParams.append("search", filters.search)
    }

    const url = `/activity-logs/recent?${queryParams.toString()}`;

    return api.get(url);
  },
};

export default api;
