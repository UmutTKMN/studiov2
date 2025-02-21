const FeedbackService = require('../services/Feedback.Service');
const { ErrorHandler } = require('../../middleware/error');

class FeedbackController {
  static async createFeedback(req, res, next) {
    try {
      const feedbackData = {
        ...req.body,
        user_id: req.user?.id || null,
        status: 'PENDING',
        priority: req.body.priority || 'LOW'
      };

      const newFeedback = await FeedbackService.createFeedback(feedbackData);
      res.status(201).json({
        success: true,
        message: "Geri bildiriminiz başarıyla iletildi",
        feedback: newFeedback
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getFeedback(req, res, next) {
    try {
      const feedback = await FeedbackService.getFeedbackById(req.params.id);
      res.status(200).json({
        success: true,
        feedback
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 404));
    }
  }

  static async getAllFeedbacks(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        status: req.query.status,
        priority: req.query.priority,
        search: req.query.search,
        limit: req.query.limit ? parseInt(req.query.limit) : undefined
      };

      const feedbacks = await FeedbackService.getAllFeedbacks(filters);
      res.status(200).json({
        success: true,
        feedbacks
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async updateFeedback(req, res, next) {
    try {
      const updateData = {
        status: req.body.status,
        priority: req.body.priority,
        admin_notes: req.body.admin_notes
      };

      const updatedFeedback = await FeedbackService.updateFeedback(
        req.params.id,
        req.user.id,
        updateData
      );

      res.status(200).json({
        success: true,
        message: "Geri bildirim başarıyla güncellendi",
        feedback: updatedFeedback
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async deleteFeedback(req, res, next) {
    try {
      await FeedbackService.deleteFeedback(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: "Geri bildirim başarıyla silindi"
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getFeedbackStats(req, res, next) {
    try {
      const stats = await FeedbackService.getFeedbackStats();
      res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getFeedbacksByEmail(req, res, next) {
    try {
      const feedbacks = await FeedbackService.getFeedbacksByEmail(req.query.email);
      res.status(200).json({
        success: true,
        feedbacks
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async getFeedbacksByType(req, res, next) {
    try {
      const feedbacks = await FeedbackService.getFeedbacksByType(req.params.type);
      res.status(200).json({
        success: true,
        feedbacks
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }

  static async searchFeedbacks(req, res, next) {
    try {
      const feedbacks = await FeedbackService.searchFeedbacks(req.query.q);
      res.status(200).json({
        success: true,
        feedbacks
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 400));
    }
  }
}

module.exports = FeedbackController;
