const TicketCategory = require("../models/TicketCategory.Model");
const ActivityLogService = require("./ActivityLog.Service");
const { ErrorHandler } = require("../middleware/error");

class TicketCategoryService {
  static async createCategory(userId, categoryData) {
    try {
      const result = await TicketCategory.create(categoryData);

      await ActivityLogService.logActivity(
        userId,
        "CREATE_TICKET_CATEGORY",
        "ticket_categories",
        result.category_id,
        `Yeni destek kategorisi oluşturuldu: ${categoryData.name}`
      );

      return result;
    } catch (error) {
      throw new ErrorHandler("Kategori oluşturulamadı", 400);
    }
  }

  static async getAllCategories(includeInactive = false) {
    try {
      return await TicketCategory.findAll(includeInactive);
    } catch (error) {
      throw new ErrorHandler("Kategoriler getirilemedi", 400);
    }
  }

  static async updateCategory(categoryId, userId, categoryData) {
    try {
      await TicketCategory.update(categoryId, categoryData);

      await ActivityLogService.logActivity(
        userId,
        "UPDATE_TICKET_CATEGORY",
        "ticket_categories",
        categoryId,
        `Destek kategorisi güncellendi: ${categoryData.name}`
      );

      return await TicketCategory.findById(categoryId);
    } catch (error) {
      throw new ErrorHandler("Kategori güncellenemedi", 400);
    }
  }

  static async deleteCategory(categoryId, userId) {
    try {
      await TicketCategory.delete(categoryId);

      await ActivityLogService.logActivity(
        userId,
        "DELETE_TICKET_CATEGORY",
        "ticket_categories",
        categoryId,
        `Destek kategorisi silindi`
      );

      return { success: true };
    } catch (error) {
      throw new ErrorHandler("Kategori silinemedi", 400);
    }
  }
}

module.exports = TicketCategoryService;
