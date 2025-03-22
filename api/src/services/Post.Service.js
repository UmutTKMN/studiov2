const Post = require("../models/Post.Model");
const CategoryService = require("./Category.Service");
const ActivityLogService = require("./ActivityLog.Service");

class PostService {
  static async createPost(postData) {
    try {
      await this.validateCategory(postData.post_category);
      const result = await Post.create(postData);

      await ActivityLogService.logActivity(
        postData.post_author,
        "CREATE",
        "posts",
        result.insertId,
        `Yeni yazı oluşturuldu: ${postData.post_title}`
      );

      return await Post.findByIdOrSlug(result.insertId);
    } catch (error) {
      throw new Error(`Blog yazısı oluşturma hatası: ${error.message}`);
    }
  }

  static async getPost(identifier) {
    try {
      const post = await Post.findByIdOrSlug(identifier);
      if (!post) throw new Error("Blog yazısı bulunamadı");
      return post;
    } catch (error) {
      throw new Error(`Blog yazısı alma hatası: ${error.message}`);
    }
  }

  static async getAllPosts(options = {}) {
    try {
      const {
        filters = {},
        sort = { field: "post_createdAt", direction: "DESC" },
        page = 1,
        limit = 10,
      } = options;
      // Filtreleme parametrelerini hazırla
      const queryFilters = {};
      // Sadece gerekli filtreleri ekle
      if (filters.search) {
        queryFilters.search = filters.search;
      }
      if (filters.status) {
        queryFilters.post_status = filters.status;
      }
      // Tarih aralığı filtresi
      if (filters.startDate || filters.endDate) {
        queryFilters.dateRange = {
          start: filters.startDate,
          end: filters.endDate,
        };
      }
      // Veritabanı sorgusunu yap
      const result = await Post.findAll({
        filters: queryFilters,
        sort,
        pagination: {
          page,
          limit,
        },
      });

      return {
        posts: result.posts,
        pagination: {
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Blog yazıları alma hatası: ${error.message}`);
    }
  }

  static async updatePost(identifier, userId, userRole, postData) {
    try {
      const post = await Post.findByIdOrSlug(identifier);
      if (!post) throw new Error("Blog yazısı bulunamadı");

      if (userRole !== "admin" && post.post_author !== userId) {
        throw new Error("Bu yazıyı güncelleme yetkiniz yok");
      }

      await Post.update(identifier, postData);

      await ActivityLogService.logActivity(
        userId,
        "UPDATE",
        "posts",
        post.post_id,
        `Yazı güncellendi: ${postData.post_title || post.post_title}`
      );

      return await Post.findByIdOrSlug(identifier);
    } catch (error) {
      throw new Error(`Blog yazısı güncelleme hatası: ${error.message}`);
    }
  }

  static async deletePost(identifier, userId, userRole) {
    try {
      const post = await Post.findByIdOrSlug(identifier);
      if (!post) throw new Error("Blog yazısı bulunamadı");

      if (userRole !== "admin" && post.post_author !== userId) {
        throw new Error("Bu yazıyı silme yetkiniz yok");
      }

      await Post.delete(identifier);

      await ActivityLogService.logActivity(
        userId,
        "DELETE",
        "posts",
        post.post_id,
        `Yazı silindi: ${post.post_title}`
      );

      return true;
    } catch (error) {
      throw new Error(`Blog yazısı silme hatası: ${error.message}`);
    }
  }

  static async validateCategory(categoryId) {
    const category = await CategoryService.getCategory(categoryId);
    if (!category) throw new Error("Seçilen kategori bulunamadı");
  }
}

module.exports = PostService;
