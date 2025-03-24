const ActivityLog = require("../models/ActivityLog.Model");

class ActivityLogService {
  static async logActivity(userId, action, table, recordId, description) {
    try {
      const logData = {
        log_user_id: userId,
        log_action: action,
        log_table: table,
        log_record_id: recordId,
        log_description: description,
      };

      await ActivityLog.create(logData);
    } catch (error) {
      console.error("Activity logging error:", error);
      // Log hatası uygulamayı etkilemesin
    }
  }

  static async getUserActivity(userId, limit) {
    try {
      return await ActivityLog.findByUserId(userId, limit);
    } catch (error) {
      throw new Error("Kullanıcı aktiviteleri alınamadı: " + error.message);
    }
  }

  static async getTableActivity(tableName, limit) {
    try {
      return await ActivityLog.findByTable(tableName, limit);
    } catch (error) {
      throw new Error("Tablo aktiviteleri alınamadı: " + error.message);
    }
  }

  static async getRecentActivity(page, limit, filters) {
    try {
      return await ActivityLog.getRecentActivity(page, limit, filters);
    } catch (error) {
      throw new Error("Son aktiviteler alınamadı: " + error.message);
    }
  }
}

module.exports = ActivityLogService;
