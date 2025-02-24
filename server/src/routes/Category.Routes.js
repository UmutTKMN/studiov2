const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const categorySchemas = require("../validators/category.validator");

// Public rotalar
router.get("/", CategoryController.getAllCategories);
router.get("/stats", CategoryController.getCategoryStats);
router.get("/:slug", CategoryController.getCategoryBySlug);
router.get("/:slug/posts", CategoryController.getCategoryPosts);

router.use(authenticate);
router.use(checkRole(["admin"]));

router.post(
  "/",
  validate(categorySchemas.create),
  CategoryController.createCategory
);
router.put(
  "/:slug",
  validate(categorySchemas.update),
  CategoryController.updateCategory
);
router.delete("/:slug", CategoryController.deleteCategory);

module.exports = router;
