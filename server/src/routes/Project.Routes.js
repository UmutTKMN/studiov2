const express = require("express");
const router = express.Router();
const ProjectController = require("../controllers/Project.Controller");
const validate = require("../middleware/validate");
const projectSchemas = require("../validators/project.validator");
const { authenticate, checkRole } = require("../middleware/auth");

// Public routes
router.get("/", ProjectController.getAllProjects);
router.get("/:identifier", ProjectController.getProject);

// Protected routes
router.use(authenticate);

router.post("/", 
  checkRole(["admin"]),
  validate(projectSchemas.create), 
  ProjectController.createProject
);

router.put("/:identifier",
  checkRole(["admin"]),
  validate(projectSchemas.update),
  ProjectController.updateProject
);

router.delete("/:identifier",
  checkRole(["admin"]),
  ProjectController.deleteProject
);

module.exports = router;
