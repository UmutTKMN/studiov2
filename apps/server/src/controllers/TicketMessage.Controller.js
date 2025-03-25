const TicketMessageService = require("../services/TicketMessage.Service");

class TicketMessageController {
  static async createMessage(req, res, next) {
    try {
      const messages = await TicketMessageService.createMessage(
        req.params.ticketId,
        req.user.id,
        req.body,
        req.user.role?.name === 'admin'
      );

      res.status(201).json({
        success: true,
        message: "Mesaj başarıyla eklendi",
        messages
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req, res, next) {
    try {
      const messages = await TicketMessageService.getTicketMessages(req.params.ticketId);

      res.status(200).json({
        success: true,
        messages
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      await TicketMessageService.markMessageAsRead(req.params.messageId, req.user.id);

      res.status(200).json({
        success: true,
        message: "Mesaj okundu olarak işaretlendi"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TicketMessageController;