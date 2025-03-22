import api from "./api";

export const projectService = {
  getAllProjects: () => api.get("/projects"),
  getProject: (identifier) => api.get(`/projects/${identifier}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (identifier, data) => api.put(`/projects/${identifier}`, data),
  deleteProject: (identifier) => api.delete(`/projects/${identifier}`),
};
