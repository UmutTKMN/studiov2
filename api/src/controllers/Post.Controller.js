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
        post_status: req.body.post_status,
      };

      const newPost = await PostService.createPost(postData);

      res.status(201).json({
        success: true,
        message: "Blog yazısı başarıyla oluşturuldu",
        post: newPost,
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
      const options = {
        filters: {
          search: req.query.search,
          status: req.query.status,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
        },
        sort: {
          field: req.query.sortBy || "post_createdAt",
          direction: req.query.sortDir || "DESC",
        },
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const result = await PostService.getAllPosts(options);
      return res.status(200).json(result);
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
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
        post: updatedPost,
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
        message: "Blog yazısı başarıyla silindi",
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }
}

module.exports = PostController;
