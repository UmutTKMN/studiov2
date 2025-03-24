const TicketCategoryService = require("../services/TicketCategory.Service");

class TicketCategoryController {
  static async createCategory(req, res, next) {
    try {
      const category = await TicketCategoryService.createCategory(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Kategori başarıyla oluşturuldu",
        category
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await TicketCategoryService.getAllCategories(
        req.query.includeInactive === 'true'
      );

      res.status(200).json({
        success: true,
        categories
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const category = await TicketCategoryService.updateCategory(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Kategori başarıyla güncellendi",
        category
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCategory(req, res, next) {
    try {
      await TicketCategoryService.deleteCategory(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: "Kategori başarıyla silindi"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TicketCategoryController;