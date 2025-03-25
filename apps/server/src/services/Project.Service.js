const Project = require("../models/Project.Model");
const ActivityLogService = require("./ActivityLog.Service");

class ProjectService {
  static async createProject(projectData) {
    try {
      const result = await Project.create(projectData);

      await ActivityLogService.logActivity(
        projectData.project_owner,
        "CREATE",
        "projects",
        result.project_id,
        `Yeni proje oluşturuldu: ${projectData.project_title}`
      );

      return result;
    } catch (error) {
      throw new Error("Proje oluşturma hatası: " + error.message);
    }
  }

  static async getProject(identifier) {
    try {
      const project = await Project.findByIdOrSlug(identifier);
      if (!project) throw new Error("Proje bulunamadı");
      return project;
    } catch (error) {
      throw new Error(`Proje alma hatası: ${error.message}`);
    }
  }

  static async getAllProjects(filters = {}) {
    try {
      return await Project.findAll(filters);
    } catch (error) {
      throw new Error("Projeleri alma hatası: " + error.message);
    }
  }

  static async updateProject(identifier, userId, projectData) {
    try {
      const project = await Project.findByIdOrSlug(identifier);
      if (!project) throw new Error("Proje bulunamadı");

      if (project.project_owner !== userId) {
        throw new Error("Bu projeyi güncelleme yetkiniz yok");
      }

      await Project.update(identifier, projectData);

      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "projects",
        project.project_id,
        `Proje güncellendi: ${
          projectData.project_title || project.project_title
        }`
      );

      return await Project.findByIdOrSlug(identifier);
    } catch (error) {
      throw new Error("Proje güncelleme hatası: " + error.message);
    }
  }

  static async deleteProject(identifier, userId) {
    try {
      const project = await Project.findByIdOrSlug(identifier);
      if (!project) throw new Error("Proje bulunamadı");

      if (project.project_owner !== userId) {
        throw new Error("Bu projeyi silme yetkiniz yok");
      }

      await Project.delete(identifier);

      await ActivityLogService.logActivity(
        userId,
        "DELETE",
        "projects",
        project.project_id,
        `Proje silindi: ${project.project_title}`
      );

      return true;
    } catch (error) {
      throw new Error("Proje silme hatası: " + error.message);
    }
  }
}

module.exports = ProjectService;
