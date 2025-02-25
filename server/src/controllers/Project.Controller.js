const ProjectService = require("../services/Project.Service");
const { ErrorHandler } = require("../middleware/error");

class ProjectController {
  static async createProject(req, res, next) {
    try {
      const projectData = {
        project_title: req.body.project_title,
        project_description: req.body.project_description,
        project_owner: req.user.id,
        project_tags: req.body.project_tags,
        project_status: req.body.project_status,
        project_start_date: req.body.project_start_date,
        project_end_date: req.body.project_end_date,
        project_budget: req.body.project_budget
      };

      const newProject = await ProjectService.createProject(projectData);

      res.status(201).json({
        success: true,
        message: "Proje başarıyla oluşturuldu",
        project: newProject
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getProject(req, res, next) {
    try {
      const project = await ProjectService.getProject(req.params.identifier);
      res.status(200).json({ success: true, project });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async getAllProjects(req, res, next) {
    try {
      const projects = await ProjectService.getAllProjects(req.query);
      res.status(200).json({ success: true, projects });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateProject(req, res, next) {
    try {
      const updatedProject = await ProjectService.updateProject(
        req.params.identifier,
        req.user.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Proje başarıyla güncellendi",
        project: updatedProject
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async deleteProject(req, res, next) {
    try {
      await ProjectService.deleteProject(req.params.identifier, req.user.id);
      res.status(200).json({
        success: true,
        message: "Proje başarıyla silindi"
      });
    } catch (error) {
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
