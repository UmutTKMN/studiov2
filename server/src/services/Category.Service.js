const Category = require("../models/Category.Model");
const ActivityLogService = require("./ActivityLog.Service");

class CategoryService {
  static async createCategory(categoryData, userId) {
    try {
      const result = await Category.create(categoryData);
      const newCategory = await Category.findByIdOrSlug(result.insertId);

      await ActivityLogService.logActivity(
        userId,
        "CREATE",
        "categories",
        result.insertId,
        `Yeni kategori oluşturuldu: ${categoryData.category_name}`
      );

      return newCategory;
    } catch (error) {
      throw new Error("Kategori oluşturma hatası: " + error.message);
    }
  }

  static async getCategory(identifier) {
    try {
      const category = await Category.findByIdOrSlug(identifier);
      if (!category) throw new Error("Kategori bulunamadı");
      return category;
    } catch (error) {
      throw new Error(`Kategori alma hatası: ${error.message}`);
    }
  }

  static async getAllCategories() {
    try {
      return await Category.findAll();
    } catch (error) {
      throw new Error("Kategorileri alma hatası: " + error.message);
    }
  }

  static async updateCategory(identifier, categoryData, userId) {
    try {
      const category = await Category.findByIdOrSlug(identifier);
      if (!category) throw new Error("Kategori bulunamadı");

      await Category.update(identifier, categoryData);

      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "categories",
        category.id,
        `Kategori güncellendi: ${categoryData.category_name || category.name}`
      );

      return await Category.findByIdOrSlug(identifier);
    } catch (error) {
      throw new Error("Kategori güncelleme hatası: " + error.message);
    }
  }

  static async deleteCategory(identifier, userId) {
    try {
      const category = await Category.findByIdOrSlug(identifier);
      if (!category) throw new Error("Kategori bulunamadı");

      if (category.post_count > 0) {
        throw new Error("Bu kategoriye ait yazılar bulunmaktadır");
      }

      await Category.delete(identifier);

      await ActivityLogService.logActivity(
        userId,
        "DELETE",
        "categories",
        category.id,
        `Kategori silindi: ${category.name}`
      );

      return true;
    } catch (error) {
      throw new Error(`Kategori silme hatası: ${error.message}`);
    }
  }
}

module.exports = CategoryService;
