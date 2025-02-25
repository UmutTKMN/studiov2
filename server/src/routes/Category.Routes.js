const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const categorySchemas = require("../validators/category.validator");

// Public rotalar
router.get("/", CategoryController.getAllCategories);
router.get("/:identifier", CategoryController.getCategory);

// Protected rotalar
router.use(authenticate);
router.use(checkRole(["admin"]));

router.post("/", validate(categorySchemas.create), CategoryController.createCategory);
router.put("/:identifier", validate(categorySchemas.update), CategoryController.updateCategory);
router.delete("/:identifier", CategoryController.deleteCategory);

module.exports = router;
