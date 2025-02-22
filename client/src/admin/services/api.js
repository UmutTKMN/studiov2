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

export const userService = {
  getAllUsers: async (page = 1, limit = 20, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Temel parametreler
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      // Filtreleme parametreleri
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, value);
        }
      });
      const url = `/auth/users?${queryParams.toString()}`;

      const response = await api.get(url);
      if (!response.data.success) {
        throw new Error(response.data.message || "Kullanıcılar getirilemedi");
      }

      return {
        users: response.data.users || [],
        pagination: {
          total: response.data.total || 0,
          page: response.data.page || page,
          totalPages: response.data.totalPages || 0,
          limit: response.data.limit || limit,
        },
      };
    } catch (error) {
      console.error("User Service Error:", error);
      throw new Error(
        error.response?.data?.message ||
          "Kullanıcılar yüklenirken bir hata oluştu"
      );
    }
  },
};

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
      queryParams.append("search", filters.search);
    }

    const url = `/activity-logs/recent?${queryParams.toString()}`;

    return api.get(url);
  },
};

export default api;
