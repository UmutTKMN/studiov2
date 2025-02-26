const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/Category.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const categorySchemas = require("../validators/category.validator");

// Public rotalar - Herkes erişebilir
router.get("/", CategoryController.getAllCategories);
router.get("/:identifier", CategoryController.getCategory);

// Protected rotalar
router.use(authenticate);

// Admin rotaları - Sadece Admin erişebilir
router.post(
  "/", 
  checkRole(["admin"]),
  validate(categorySchemas.create), 
  CategoryController.createCategory
);

router.put(
  "/:identifier",
  checkRole(["admin"]),
  validate(categorySchemas.update),
  CategoryController.updateCategory
);

router.delete(
  "/:identifier",
  checkRole(["admin"]),
  CategoryController.deleteCategory
);

module.exports = router;
