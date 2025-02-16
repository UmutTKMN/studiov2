const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/Project.Controller");
const validate = require("../middleware/validate");
const projectSchemas = require("../validators/project.validator");
const { authenticate, checkRole } = require("../middleware/auth");

// Public routes
router.get("/", ProjectController.getAllProjects); // Filtreleme opsiyonel olsun
router.get("/:id", ProjectController.getProject);
router.get("/user/:userId", ProjectController.getUserProjects);
router.get("/search", ProjectController.searchProjects);

// Project CRUD operations
router.post(
  "/",
  authenticate,
  checkRole(["admin"]),
  validate(projectSchemas.create),
  ProjectController.createProject
);
router.put(
  "/:id",
  authenticate,
  checkRole(["admin"]),
  validate(projectSchemas.update),
  ProjectController.updateProject
);
router.delete(
  "/:id",
  authenticate,
  checkRole(["admin"]),
  ProjectController.deleteProject
);

module.exports = router;
