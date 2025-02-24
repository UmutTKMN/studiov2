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

  static async updateCategoryBySlug(slug, categoryData, userId) {
    try {
      const category = await Category.findBySlug(slug);
      if (!category) {
        throw new Error("Kategori bulunamadı");
      }

      const result = await Category.updateBySlug(slug, categoryData);
      
      await ActivityLogService.logActivity(
        userId,
        'UPDATE',
        'categories',
        category.category_id,
        `Kategori güncellendi: ${categoryData.category_name || category.category_name}`
      );

      return await Category.findBySlug(slug);
    } catch (error) {
      throw new Error("Kategori güncelleme hatası: " + error.message);
    }
  }

  static async deleteCategory(slug, userId) {
    try {
      // Önce kategoriyi bul
      const category = await Category.findBySlug(slug);
      if (!category) {
        throw new Error("Kategori bulunamadı");
      }

      // Kategoriye ait yazı var mı kontrol et
      const postCount = await Category.getPostCount(category.id);
      if (postCount > 0) {
        throw new Error("Bu kategoriye ait yazılar bulunmaktadır. Önce yazıları silmeniz gerekmektedir.");
      }

      // Kategoriyi sil
      await Category.deleteBySlug(slug);
      
      // Aktivite logunu kaydet
      await ActivityLogService.logActivity(
        userId,
        'DELETE',
        'categories',
        category.id,
        `Kategori silindi: ${category.name}`
      );

      return true;
    } catch (error) {
      throw new Error(`Kategori silme hatası: ${error.message}`);
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

  static async getCategoryBySlug(slug) {
    try {
      if (!slug) {
        throw new Error("Kategori slug'ı gereklidir");
      }

      const category = await Category.findBySlug(slug);
      
      if (!category) {
        throw new Error("Kategori bulunamadı");
      }

      return category;
    } catch (error) {
      throw new Error(`Kategori alma hatası: ${error.message}`);
    }
  }
  
  static async getCategoryPosts(slug) {
    try {
      const category = await Category.findBySlug(slug);
      if (!category) {
        throw new Error("Kategori bulunamadı");
      }

      const posts = await Category.getPostsBySlug(slug);
      return {
        category,
        posts
      };
    } catch (error) {
      throw new Error(`Kategori yazıları alma hatası: ${error.message}`);
    }
  }
}

module.exports = CategoryService;
