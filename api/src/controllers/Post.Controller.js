const PostService = require("../services/Post.Service");
const { ErrorHandler } = require("../middleware/error");

class PostController {
  static async createPost(req, res, next) {
    try {
      // Post verilerini hazırla
      const postData = {
        post_title: req.body.post_title,
        post_excerpt: req.body.post_excerpt,
        post_content: req.body.post_content,
        post_author: req.user.id, // Kullanıcı ID'sini doğru şekilde al
        post_category: req.body.post_category,
        post_tags: req.body.post_tags,
        post_image: req.file?.filename || req.body.post_image,
        post_status: req.body.post_status || 'draft'
      };

      console.log('Creating post with data:', postData); // Debug için

      const newPost = await PostService.createPost(postData);

      res.status(201).json({
        success: true,
        message: "Blog yazısı başarıyla oluşturuldu",
        post: newPost,
      });
    } catch (error) {
      console.error('Post creation error:', error); // Debug için
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getPost(req, res, next) {
    try {
      const post = await PostService.getPostById(req.params.id);
      res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async getAllPosts(req, res, next) {
    try {
      const filters = {
        ...req.query,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined
      };
      
      const posts = await PostService.getAllPosts(filters);
      res.status(200).json({
        success: true,
        posts: posts
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updatePost(req, res, next) {
    try {
      console.log('Update request:', {
        postId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
        body: req.body
      });

      const postData = {
        post_title: req.body.post_title,
        post_excerpt: req.body.post_excerpt,
        post_content: req.body.post_content,
        post_category: req.body.post_category,
        post_tags: req.body.post_tags,
        post_status: req.body.post_status,
        post_image: req.file?.filename || req.body.post_image
      };

      const updatedPost = await PostService.updatePost(
        req.params.id,
        req.user.id,
        req.user.role,
        postData
      );

      res.status(200).json({
        success: true,
        message: "Blog yazısı başarıyla güncellendi",
        post: updatedPost
      });
    } catch (error) {
      console.error('Update post error:', error);
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async deletePost(req, res, next) {
    try {
      console.log('Delete request:', {
        postId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role
      });

      await PostService.deletePost(
        req.params.id,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: "Blog yazısı başarıyla silindi"
      });
    } catch (error) {
      console.error('Delete post error:', error);
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getUserPosts(req, res, next) {
    try {
      const posts = await PostService.getUserPosts(req.params.userId);
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async searchPosts(req, res, next) {
    try {
      const posts = await PostService.searchPosts(req.query.q);
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getPostsByCategory(req, res, next) {
    try {
      const posts = await PostService.getPostsByCategory(req.params.categoryId);
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }
}

module.exports = PostController;
