const Ticket = require("../models/Ticket.Model");
const ActivityLogService = require("./ActivityLog.Service");
const { ErrorHandler } = require("../middleware/error");

class TicketService {
  static async createTicket(userId, ticketData) {
    try {
      // Kategori ID'sinin geçerliliğini kontrol et
      const category = await Ticket.getCategoryById(ticketData.category_id);
      if (!category) {
        throw new ErrorHandler("Geçersiz kategori seçildi", 400);
      }

      const ticket = {
        user_id: userId,
        title: ticketData.title,
        description: ticketData.description,
        category_id: ticketData.category_id,
        priority: ticketData.priority || "medium",
      };

      const result = await Ticket.create(ticket);

      await ActivityLogService.logActivity(
        userId,
        "CREATE_TICKET",
        "support_tickets",
        result.ticket_id,
        `Yeni destek talebi oluşturuldu: ${ticketData.title}`
      );

      return result;
    } catch (error) {
      throw new ErrorHandler(
        error.message || "Destek talebi oluşturulamadı",
        error.statusCode || 400
      );
    }
  }

  static async getAllTickets(filters = {}) {
    try {
      return await Ticket.findAll(filters);
    } catch (error) {
      throw new ErrorHandler("Destek talepleri getirilemedi", 400);
    }
  }

  static async getUserTickets(userId, filters = {}) {
    try {
      return await Ticket.findUserTickets(userId, filters);
    } catch (error) {
      throw new ErrorHandler("Destek talepleri getirilemedi", 400);
    }
  }

  static async getTicketDetails(ticketId, userId) {
    try {
      const ticket = await Ticket.findById(ticketId, userId);
      if (!ticket) {
        throw new ErrorHandler("Destek talebi bulunamadı", 404);
      }

      const messages = await Ticket.getMessages(ticketId, userId);
      return { ticket, messages };
    } catch (error) {
      throw new ErrorHandler(error.message, error.statusCode || 400);
    }
  }

  static async addMessage(ticketId, userId, messageData, isAdmin = false) {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new ErrorHandler("Destek talebi bulunamadı", 404);
      }

      const message = {
        ticket_id: ticketId,
        user_id: userId,
        message: messageData.message,
        is_admin: isAdmin,
        attachments: messageData.attachments || null,
      };

      const result = await Ticket.addMessage(message);

      await ActivityLogService.logActivity(
        userId,
        "ADD_TICKET_MESSAGE",
        "ticket_messages",
        result.message_id, // result.insertId yerine result.message_id kullanılıyor
        `Destek talebine yeni mesaj eklendi`
      );

      return await Ticket.getMessages(ticketId);
    } catch (error) {
      throw new ErrorHandler(error.message, error.statusCode || 400);
    }
  }

  static async updateTicketStatus(ticketId, status, userId) {
    try {
      const result = await Ticket.updateStatus(ticketId, status, userId);
      if (!result || result.rowCount === 0) {
        // result.affectedRows yerine result.rowCount kullanılıyor
        throw new ErrorHandler("Destek talebi güncellenemedi", 400);
      }

      await ActivityLogService.logActivity(
        userId,
        "UPDATE_TICKET_STATUS",
        "support_tickets",
        ticketId,
        `Destek talebi durumu güncellendi: ${status}`
      );

      return await Ticket.findById(ticketId);
    } catch (error) {
      throw new ErrorHandler(error.message, error.statusCode || 400);
    }
  }

  static async assignTicket(ticketId, adminId) {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        throw new ErrorHandler("Destek talebi bulunamadı", 404);
      }

      const result = await Ticket.assignStaff(ticketId, adminId);
      if (!result || result.rowCount === 0) {
        // result.affectedRows yerine result.rowCount kullanılıyor
        throw new ErrorHandler("Destek görevlisi atanamadı", 400);
      }

      await ActivityLogService.logActivity(
        adminId,
        "ASSIGN_TICKET",
        "support_tickets",
        ticketId,
        `Destek talebine görevli atandı`
      );

      return await Ticket.findById(ticketId);
    } catch (error) {
      throw new ErrorHandler(error.message, error.statusCode || 400);
    }
  }

  static async getCategories() {
    try {
      return await Ticket.getCategories();
    } catch (error) {
      throw new ErrorHandler("Kategoriler getirilemedi", 400);
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const category = await Ticket.getCategoryById(categoryId);
      if (!category) {
        throw new ErrorHandler("Kategori bulunamadı", 404);
      }
      return category;
    } catch (error) {
      throw new ErrorHandler(
        error.message || "Kategori getirilemedi",
        error.statusCode || 400
      );
    }
  }
}

module.exports = TicketService;
