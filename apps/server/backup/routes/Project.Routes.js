const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/Project.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const projectSchemas = require("../validators/project.validator");

// Public routes
router.get("/", ProjectController.getAllProjects);
router.get("/:identifier", ProjectController.getProject);

// Protected routes - Admin only
router.use(authenticate);
router.use(checkRole(["admin"]));

router.post("/", validate(projectSchemas.create), ProjectController.createProject);
router.put("/:identifier", validate(projectSchemas.update), ProjectController.updateProject);
router.delete("/:identifier", ProjectController.deleteProject);

module.exports = router;
