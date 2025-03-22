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
router.get("/:identifier", RoleController.getRole);
router.put("/:identifier", validate(roleSchemas.update), RoleController.updateRole);
router.delete("/:identifier", RoleController.deleteRole);
router.post("/assign/:userId", validate(roleSchemas.assign), RoleController.assignRole);

module.exports = router;
