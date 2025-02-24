import api from './api';

export const projectService = {
  getAllProjects: () => api.get("/projects"),
  getProjectBySlug: (slug) => api.get(`/projects/${slug}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
}; 