import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Doğru kullanım
});

// Request interceptor'ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      window.location.href = '/login';
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

export default api;
