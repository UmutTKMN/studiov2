const TicketMessage = require("../models/TicketMessage.Model");
const ActivityLogService = require("./ActivityLog.Service");
const { ErrorHandler } = require("../middleware/error");

class TicketMessageService {
  static async createMessage(ticketId, userId, messageData, isAdmin = false) {
    try {
      const message = {
        ticket_id: ticketId,
        user_id: userId,
        message: messageData.message,
        is_admin: isAdmin,
        attachments: messageData.attachments || null,
      };

      const result = await TicketMessage.create(message);

      await ActivityLogService.logActivity(
        userId,
        "CREATE_TICKET_MESSAGE",
        "ticket_messages",
        result.message_id,
        `Destek talebine yeni mesaj eklendi: ${ticketId}`
      );

      return await TicketMessage.findByTicketId(ticketId);
    } catch (error) {
      throw new ErrorHandler("Mesaj eklenemedi", 400);
    }
  }

  static async getTicketMessages(ticketId) {
    try {
      return await TicketMessage.findByTicketId(ticketId);
    } catch (error) {
      throw new ErrorHandler("Mesajlar getirilemedi", 400);
    }
  }

  static async markMessageAsRead(messageId, userId) {
    try {
      const result = await TicketMessage.markAsRead(messageId, userId);

      await ActivityLogService.logActivity(
        userId,
        "READ_TICKET_MESSAGE",
        "ticket_messages",
        messageId,
        `Mesaj okundu olarak işaretlendi`
      );

      return result;
    } catch (error) {
      throw new ErrorHandler("Mesaj durumu güncellenemedi", 400);
    }
  }
}

module.exports = TicketMessageService;
