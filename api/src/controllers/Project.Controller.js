const ProjectService = require("../services/Project.Service");
const Project = require("../models/Project.Model"); // Project modelini ekle
const { ErrorHandler } = require("../middleware/error");

class ProjectController {
  static async createProject(req, res, next) {
    try {
      // Debug için
      console.log("User in request:", req.user);
      console.log("Request body:", req.body);

      const projectData = {
        project_title: req.body.project_title,
        project_description: req.body.project_description,
        project_owner: req.user.id, // user.id'yi project_owner olarak kullan
        project_tags: req.body.project_tags,
        project_status: req.body.project_status || "pending",
        project_start_date: req.body.project_start_date,
        project_end_date: req.body.project_end_date,
        project_budget: req.body.project_budget,
        project_image: req.body.project_image,
      };

      console.log("Project data to create:", projectData); // Debug için

      const newProject = await ProjectService.createProject(projectData);

      res.status(201).json({
        success: true,
        message: "Proje başarıyla oluşturuldu",
        project: newProject,
      });
    } catch (error) {
      console.error("Project creation error:", error); // Debug için
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getProject(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllProjects(req, res, next) {
    try {
      const filters = {
        ...req.query,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      };

      const projects = await ProjectService.getAllProjects(req.query);
      res.status(200).json({
        success: true,
        projects: projects,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateProject(req, res, next) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);

      // Proje sahibi kontrolü
      if (project.user_id !== req.user.user_id) {
        return res.status(403).json({
          success: false,
          message: "Bu projeyi düzenleme yetkiniz yok",
        });
      }

      const projectData = {
        ...req.body,
        image_url: req.file?.path || req.body.image_url,
      };

      const updatedProject = await ProjectService.updateProject(
        req.params.id,
        req.user.user_id, // user.id yerine user.user_id kullanılacak
        projectData
      );
      res.json({ success: true, project: updatedProject });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProject(req, res, next) {
    try {
      console.log("Delete request:", {
        projectId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
      }); // Debug için

      // Admin yetkisi kontrolü
      if (req.user.role === "admin") {
        // Admin için direkt ProjectService kullan
        await ProjectService.deleteProject(req.params.id, req.user.id);
        return res.status(200).json({
          success: true,
          message: "Proje başarıyla silindi (Admin)",
        });
      }

      // Normal kullanıcı için owner kontrolü
      await ProjectService.deleteProject(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: "Proje başarıyla silindi",
      });
    } catch (error) {
      console.error("Delete controller error:", error);
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getUserProjects(req, res, next) {
    try {
      const projects = await ProjectService.getUserProjects(req.params.userId);
      res.json({ success: true, projects });
    } catch (error) {
      next(error);
    }
  }

  static async getProjectBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const project = await ProjectService.getProjectBySlug(slug);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Proje bulunamadı",
        });
      }
      res.status(200).json({
        success: true,
        project,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  static async searchProjects(req, res, next) {
    try {
      const { q } = req.query;
      const projects = await ProjectService.searchProjects(q);

      res.status(200).json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
}

module.exports = ProjectController;
