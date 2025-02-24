const CategoryService = require("../services/Category.Service");
const { ErrorHandler } = require("../middleware/error");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const categoryData = {
        category_name: req.body.category_name,
        category_description: req.body.category_description,
      };

      const newCategory = await CategoryService.createCategory(categoryData);

      res.status(201).json({
        success: true,
        message: "Kategori başarıyla oluşturuldu",
        category: {
          id: newCategory.insertId,
          ...categoryData,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getCategory(req, res, next) {
    try {
      const category = await CategoryService.getCategoryById(req.params.id);
      if (!category) {
        return next(new ErrorHandler("Kategori bulunamadı", 404));
      }

      res.status(200).json({
        success: true,
        category: {
          id: category.category_id,
          name: category.category_name,
          description: category.category_description,
          createdAt: category.category_createdAt,
          updatedAt: category.category_updatedAt,
        },
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const { slug } = req.params;
      
      if (!slug) {
        return next(new ErrorHandler("Kategori slug'ı gereklidir", 400));
      }

      const categoryData = {};
      if (req.body.category_name) categoryData.category_name = req.body.category_name;
      if (req.body.category_description !== undefined) {
        categoryData.category_description = req.body.category_description;
      }

      const updatedCategory = await CategoryService.updateCategoryBySlug(
        slug,
        categoryData,
        req.user?.id
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
      const { slug } = req.params;
      
      if (!slug) {
        return next(new ErrorHandler("Kategori slug'ı gereklidir", 400));
      }

      await CategoryService.deleteCategory(slug, req.user?.id);
      
      res.status(200).json({
        success: true,
        status: "success",
        message: "Kategori başarıyla silindi"
      });
    } catch (error) {
      if (error.message.includes('yazılar bulunmaktadır')) {
        return next(new ErrorHandler(error.message, 409)); // Conflict
      }
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getCategoryStats(req, res, next) {
    try {
      const stats = await CategoryService.getCategoryStats();
      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      
      if (!slug) {
        return next(new ErrorHandler("Kategori slug'ı gereklidir", 400));
      }

      const category = await CategoryService.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Kategori bulunamadı",
          status: "not_found"
        });
      }

      res.status(200).json({
        success: true,
        status: "success",
        category
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }

  static async getCategoryPosts(req, res, next) {
    try {
      const { slug } = req.params;
      const posts = await CategoryService.getCategoryPosts(slug);
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  }
}
module.exports = CategoryController;
