const CategoryService = require("../services/Category.Service");
const { ErrorHandler } = require("../middleware/error");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const categoryData = {
        category_name: req.body.category_name,
        category_description: req.body.category_description,
      };

      const newCategory = await CategoryService.createCategory(
        categoryData,
        req.user.id
      );

      res.status(201).json({
        success: true,
        message: "Kategori başarıyla oluşturuldu",
        category: newCategory,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getCategory(req, res, next) {
    try {
      const category = await CategoryService.getCategory(req.params.identifier);
      res.status(200).json({ success: true, category });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({ success: true, categories });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const updatedCategory = await CategoryService.updateCategory(
        req.params.identifier,
        req.body,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Kategori başarıyla güncellendi",
        category: updatedCategory,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.identifier, req.user.id);
      res.status(200).json({
        success: true,
        message: "Kategori başarıyla silindi",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }
}

module.exports = CategoryController;
