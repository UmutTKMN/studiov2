const Category = require("../models/Category.Model");
const ActivityLogService = require("./ActivityLog.Service");

class CategoryService {
  static async createCategory(categoryData, userId) {
    try {
      const result = await Category.create(categoryData);
      
      await ActivityLogService.logActivity(
        userId,
        'CREATE',
        'categories',
        result.insertId,
        `Yeni kategori oluşturuldu: ${categoryData.category_name}`
      );

      return { id: result.insertId, ...categoryData };
    } catch (error) {
      throw new Error("Kategori oluşturma hatası: " + error.message);
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const category = await Category.findByIdWithPosts(categoryId);
      if (!category) {
        throw new Error("Kategori bulunamadı");
      }
      return category;
    } catch (error) {
      throw new Error("Kategori alma hatası: " + error.message);
    }
  }

  static async getAllCategories() {
    try {
      const categories = await Category.findAll();
      // Her kategori için yazı sayısını al
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const postCount = await Category.getPostCount(category.id);
          return { ...category, postCount };
        })
      );
      return categoriesWithCount;
    } catch (error) {
      throw new Error("Kategorileri alma hatası: " + error.message);
    }
  }

  static async updateCategory(categoryId, categoryData, userId) {
    try {
      await Category.update(categoryId, categoryData);
      
      await ActivityLogService.logActivity(
        userId,
        'UPDATE',
        'categories',
        categoryId,
        `Kategori güncellendi: ${categoryData.category_name}`
      );

      return await Category.findById(categoryId);
    } catch (error) {
      throw new Error("Kategori güncelleme hatası: " + error.message);
    }
  }

  static async deleteCategory(categoryId, userId) {
    try {
      const category = await Category.findById(categoryId);
      if (!category) throw new Error("Kategori bulunamadı");

      await Category.delete(categoryId);
      
      await ActivityLogService.logActivity(
        userId,
        'DELETE',
        'categories',
        categoryId,
        `Kategori silindi: ${category.category_name}`
      );

      return true;
    } catch (error) {
      throw new Error("Kategori silme hatası: " + error.message);
    }
  }

  static async getCategoryStats() {
    try {
      const categories = await Category.findAll();
      const stats = await Promise.all(
        categories.map(async (category) => {
          const postCount = await Category.getPostCount(category.id);
          return {
            id: category.id,
            name: category.name,
            postCount,
          };
        })
      );
      return stats;
    } catch (error) {
      throw new Error("Kategori istatistikleri alma hatası: " + error.message);
    }
  }
}

module.exports = CategoryService;
