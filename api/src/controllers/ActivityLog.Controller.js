const ActivityLogService = require("../services/ActivityLog.Service");
const { ErrorHandler } = require("../middleware/error");

class ActivityLogController {
  static async getUserActivity(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 10 } = req.query;

      const activities = await ActivityLogService.getUserActivity(
        userId,
        parseInt(limit)
      );
      res.status(200).json({
        success: true,
        data: activities,
      });
    } catch (error) {
      ErrorHandler(res, error);
    }
  }

  static async getTableActivity(req, res) {
    try {
      const { tableName } = req.params;
      const { limit = 10 } = req.query;

      const activities = await ActivityLogService.getTableActivity(
        tableName,
        parseInt(limit)
      );
      res.status(200).json({
        success: true,
        data: activities,
      });
    } catch (error) {
      ErrorHandler(res, error);
    }
  }

  static async getRecentActivity(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20,
        search = '',
        action = '',
        table = '',
        sortBy = 'desc'
      } = req.query;

      const filters = {
        search,
        action,
        table,
        sortBy: sortBy.toLowerCase()
      };

      const result = await ActivityLogService.getRecentActivity(
        parseInt(page),
        parseInt(limit),
        filters
      );
      
      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      ErrorHandler(res, error);
    }
  }
}

module.exports = ActivityLogController;
