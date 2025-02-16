const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const categorySchemas = require("../validators/category.validator");

// Public rotalar
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategory);
router.get("/stats", CategoryController.getCategoryStats);
router.get("/slug/:slug", CategoryController.getCategoryBySlug);

router.use(authenticate);
router.use(checkRole(["admin"]));

router.post(
  "/",
  validate(categorySchemas.create),
  CategoryController.createCategory
);
router.put(
  "/:id",
  validate(categorySchemas.update),
  CategoryController.updateCategory
);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;
