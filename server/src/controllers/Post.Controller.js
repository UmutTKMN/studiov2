const PostService = require("../services/Post.Service");
const { ErrorHandler } = require("../middleware/error");

class PostController {
  static async createPost(req, res, next) {
    try {
      const postData = {
        post_title: req.body.post_title,
        post_excerpt: req.body.post_excerpt,
        post_content: req.body.post_content,
        post_author: req.user.id,
        post_category: parseInt(req.body.post_category),
        post_tags: req.body.post_tags,
        post_status: req.body.post_status
      };

      const newPost = await PostService.createPost(postData);

      res.status(201).json({
        success: true,
        message: "Blog yazısı başarıyla oluşturuldu",
        post: newPost
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getPost(req, res, next) {
    try {
      const post = await PostService.getPost(req.params.identifier);
      res.status(200).json({ success: true, post });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async getAllPosts(req, res, next) {
    try {
      const posts = await PostService.getAllPosts(req.query);
      res.status(200).json({ success: true, posts });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updatePost(req, res, next) {
    try {
      const updatedPost = await PostService.updatePost(
        req.params.identifier,
        req.user.id,
        req.user.role,
        req.body
      );

      res.status(200).json({
        success: true,
        message: "Blog yazısı başarıyla güncellendi",
        post: updatedPost
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async deletePost(req, res, next) {
    try {
      await PostService.deletePost(
        req.params.identifier,
        req.user.id,
        req.user.role
      );

      res.status(200).json({
        success: true,
        message: "Blog yazısı başarıyla silindi"
      });
    } catch (error) {
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
