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
};

export const categoryService = {
  getAllCategories: () => api.get("/categories"),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getCategoryPosts: (slug) => api.get(`/categories/${slug}/posts`),
};

export const projectService = {
  getAllProjects: () => api.get("/projects"),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),
};

export default api;
