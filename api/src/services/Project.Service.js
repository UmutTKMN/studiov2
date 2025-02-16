const Project = require("../models/Project.Model");
const ActivityLogService = require("./ActivityLog.Service");

class ProjectService {
  static async createProject(projectData) {
    try {
      // Zorunlu alanları kontrol et
      if (!projectData.project_owner) {
        throw new Error("Proje sahibi (owner) bilgisi eksik");
      }

      if (!projectData.project_title) {
        throw new Error("Proje başlığı gerekli");
      }

      if (!projectData.project_description) {
        throw new Error("Proje açıklaması gerekli");
      }

      console.log('Creating project with data:', projectData); // Debug için

      const result = await Project.create(projectData);
      
      // Yeni oluşturulan projeyi getir
      const newProject = await Project.findById(result.insertId);
      
      // Aktivite logu ekle
      await ActivityLogService.logActivity(
        projectData.project_owner,
        'CREATE',
        'projects',
        result.insertId,
        `Yeni proje oluşturuldu: ${projectData.project_title}`
      );

      return newProject;
    } catch (error) {
      console.error('Project service error:', error); // Debug için
      throw new Error("Proje yazısı oluşturma hatası: " + error.message);
    }
  }

  static async getAllProjects(filters = {}) {
    try {
      const projects = await Project.findAll(filters);
      return projects;
    } catch (error) {
      throw new Error("Projeleri alma hatası: " + error.message);
    }
  }

  static async getProjectById(projectId) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Proje bulunamadı");
      }
      return project;
    } catch (error) {
      throw new Error("Proje alma hatası: " + error.message);
    }
  }

  static async updateProject(projectId, userId, projectData) {
    try {
      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Proje bulunamadı");
      }
      if (project.user_id !== userId) {
        throw new Error("Bu işlem için yetkiniz yok");
      }
      await Project.update(projectId, projectData);
      
      // Aktivite logu ekle
      await ActivityLogService.logActivity(
        userId,
        'UPDATE',
        'projects',
        projectId,
        `Proje güncellendi: ${projectData.project_title || project.project_title}`
      );

      return {
        ...(await Project.findById(projectId)),
        description: projectData.description,
      };
    } catch (error) {
      throw new Error("Proje güncelleme hatası: " + error.message);
    }
  }

  static async deleteProject(projectId, userId) {
    try {
      console.log('Deleting project:', { projectId, userId }); // Debug için

      const project = await Project.findById(projectId);
      if (!project) {
        throw new Error("Proje bulunamadı");
      }

      // project_owner alanını kontrol et
      if (project.project_owner !== userId) {
        throw new Error("Bu işlem için yetkiniz yok");
      }

      await Project.delete(projectId);
      
      // Aktivite logu ekle
      await ActivityLogService.logActivity(
        userId,
        'DELETE',
        'projects',
        projectId,
        `Proje silindi: ${project.project_title}`
      );

      return true;
    } catch (error) {
      console.error('Delete project error:', error); // Debug için
      throw new Error("Proje silme hatası: " + error.message);
    }
  }

  static async getUserProjects(userId) {
    try {
      return await Project.findByUserId(userId);
    } catch (error) {
      throw new Error("Kullanıcı projelerini alma hatası: " + error.message);
    }
  }

  static async searchProjects(searchTerm) {
    try {
      return await Project.search(searchTerm);
    } catch (error) {
      throw new Error("Proje arama hatası: " + error.message);
    }
  }
}

module.exports = ProjectService;
