const Feedback = require('../models/Feedback.Model');

class FeedbackService {
  static async createFeedback(feedbackData) {
    try {
      const result = await Feedback.create(feedbackData);
      return {
        id: result.insertId,
        ...feedbackData,
        created_at: new Date(),
        status: 'PENDING'
      };
    } catch (error) {
      throw new Error("Feedback oluşturma hatası: " + error.message);
    }
  }

  static async getAllFeedbacks(filters = {}) {
    try {
      const feedbacks = await Feedback.findAll(filters);
      return feedbacks;
    } catch (error) {
      throw new Error("Feedbackleri alma hatası: " + error.message);
    }
  }

  static async getFeedbackById(id) {
    try {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        throw new Error("Feedback bulunamadı");
      }
      return feedback;
    } catch (error) {
      throw new Error("Feedback alma hatası: " + error.message);
    }
  }

  static async updateFeedback(id, adminId, updateData) {
    try {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        throw new Error("Feedback bulunamadı");
      }

      await Feedback.update(id, {
        ...updateData,
        admin_id: adminId,
        updated_at: new Date()
      });

      return await Feedback.findById(id);
    } catch (error) {
      throw new Error("Feedback güncelleme hatası: " + error.message);
    }
  }

  static async deleteFeedback(id, adminId) {
    try {
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        throw new Error("Feedback bulunamadı");
      }

      await Feedback.delete(id);
      return true;
    } catch (error) {
      throw new Error("Feedback silme hatası: " + error.message);
    }
  }

  static async getFeedbackStats() {
    try {
      return await Feedback.getStats();
    } catch (error) {
      throw new Error("Feedback istatistikleri alma hatası: " + error.message);
    }
  }

  static async getFeedbacksByEmail(email) {
    try {
      return await Feedback.findByEmail(email);
    } catch (error) {
      throw new Error("Email'e göre feedback alma hatası: " + error.message);
    }
  }

  static async getFeedbacksByType(type) {
    try {
      return await Feedback.findAll({ type });
    } catch (error) {
      throw new Error("Türe göre feedback alma hatası: " + error.message);
    }
  }

  static async getFeedbacksByStatus(status) {
    try {
      return await Feedback.findAll({ status });
    } catch (error) {
      throw new Error("Duruma göre feedback alma hatası: " + error.message);
    }
  }

  static async searchFeedbacks(searchTerm) {
    try {
      return await Feedback.findAll({ search: searchTerm });
    } catch (error) {
      throw new Error("Feedback arama hatası: " + error.message);
    }
  }
}

module.exports = FeedbackService;
