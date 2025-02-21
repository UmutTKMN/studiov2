const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/Role.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const roleSchemas = require("../validators/role.validator");

// Admin rotaları
router.use(authenticate);
router.use(checkRole(["admin"]));

router.post("/", validate(roleSchemas.create), RoleController.createRole);
router.get("/", RoleController.getAllRoles);
router.get("/stats", RoleController.getRoleStats);
router.get("/:id", RoleController.getRole);
router.put("/:id", validate(roleSchemas.update), RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

// Rol atama
router.post(
  "/assign/:userId",
  validate(roleSchemas.assign),
  RoleController.assignRole
);
router.get("/user/:userId", RoleController.getUserRole);

module.exports = router;
