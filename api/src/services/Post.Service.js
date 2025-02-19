const Post = require("../models/Post.Model");
const ActivityLogService = require("./ActivityLog.Service");

class PostService {
  static async createPost(postData) {
    try {
      // Zorunlu alanları kontrol et
      if (!postData.post_author) {
        throw new Error("Yazar ID'si gerekli");
      }

      if (!postData.post_title) {
        throw new Error("Başlık gerekli");
      }

      if (!postData.post_content) {
        throw new Error("İçerik gerekli");
      }

      const result = await Post.create(postData);

      // Yeni oluşturulan postu getir
      const newPost = await Post.findById(result.insertId);

      // Aktivite logu ekle
      await ActivityLogService.logActivity(
        postData.post_author,
        "CREATE",
        "posts",
        result.insertId,
        `Yeni yazı oluşturuldu: ${postData.post_title}`
      );

      return newPost;
    } catch (error) {
      throw new Error("Blog yazısı oluşturma hatası: " + error.message);
    }
  }

  static async getAllPosts(filters = {}) {
    try {
      const posts = await Post.findAll(filters);

      if (!posts || posts.length === 0) {
        console.log("No posts found in database"); // Debug için
        return [];
      }

      // Post verilerini düzenle
      const formattedPosts = posts.map((post) => {
        return {
          id: post.post_id,
          title: post.post_title,
          slug: post.post_slug,
          excerpt: post.post_excerpt,
          content: post.post_content,
          image: post.post_image,
          status: post.post_status,
          likes: post.post_likes || 0,
          views: post.post_views || 0,
          created_at: post.post_createdAt,
          updated_at: post.post_updatedAt,
          author: {
            name: post.author_name,
            image: post.author_image,
          },
          category: post.category_name,
          tags: post.post_tags ? post.post_tags.split(",") : [],
        };
      });

      return formattedPosts;
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      throw new Error("Blog yazılarını alma hatası: " + error.message);
    }
  }

  static async getPostById(postId) {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }
      return post;
    } catch (error) {
      throw new Error("Blog yazısı alma hatası: " + error.message);
    }
  }

  static async updatePost(postId, userId, userRole, postData) {
    try {
      console.log("Update post params:", {
        postId,
        userId,
        userRole,
        postData,
      }); // Debug için

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }

      // Admin her postu güncelleyebilir
      if (userRole === "admin") {
        await Post.update(postId, postData);
        return await Post.findById(postId);
      }

      // Post sahibi kontrolü
      if (post.post_author !== userId) {
        throw new Error("Bu işlem için yetkiniz yok");
      }

      await Post.update(postId, postData);
      return await Post.findById(postId);
    } catch (error) {
      console.error("Update post error:", error); // Debug için
      throw new Error("Blog yazısı güncelleme hatası: " + error.message);
    }
  }

  static async deletePost(postId, userId, userRole) {
    try {
      console.log("Delete post params:", { postId, userId, userRole }); // Debug için

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }

      // Admin her postu silebilir
      if (userRole === "admin") {
        await Post.delete(postId);

        // Aktivite logu ekle
        await ActivityLogService.logActivity(
          userId,
          "DELETE",
          "posts",
          postId,
          `Yazı silindi: ${post.post_title}`
        );

        return true;
      }

      // Post sahibi kontrolü
      if (post.post_author !== userId) {
        throw new Error("Bu işlem için yetkiniz yok");
      }

      await Post.delete(postId);

      // Aktivite logu ekle
      await ActivityLogService.logActivity(
        userId,
        "DELETE",
        "posts",
        postId,
        `Yazı silindi: ${post.post_title}`
      );

      return true;
    } catch (error) {
      console.error("Delete post error:", error); // Debug için
      throw new Error("Blog yazısı silme hatası: " + error.message);
    }
  }

  static async getUserPosts(userId) {
    try {
      return await Post.findByUserId(userId);
    } catch (error) {
      throw new Error("Kullanıcı yazılarını alma hatası: " + error.message);
    }
  }

  static async searchPosts(searchTerm) {
    try {
      return await Post.search(searchTerm);
    } catch (error) {
      throw new Error("Blog yazısı arama hatası: " + error.message);
    }
  }

  static async getPostsByCategory(categoryId) {
    try {
      return await Post.findByCategory(categoryId);
    } catch (error) {
      throw new Error("Kategoriye göre yazıları alma hatası: " + error.message);
    }
  }

  static async getPostBySlug(slug) {
    try {
      const post = await Post.findBySlug(slug);
      if (!post) {
        throw new Error("Blog yazısı bulunamadı");
      }
      return post;
    } catch (error) {
      throw new Error("Blog yazısı alma hatası: " + error.message);
    }
  }
}

module.exports = PostService;
