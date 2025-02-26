const TicketService = require("../services/Ticket.Service");
const TicketMessageService = require("../services/TicketMessage.Service"); // Bu satırı ekleyin
const { ErrorHandler } = require("../middleware/error");

class TicketController {
  static async createTicket(req, res, next) {
    try {
      const ticket = await TicketService.createTicket(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: "Destek talebi başarıyla oluşturuldu",
        ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllTickets(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        category_id: req.query.category_id, // category_id kullanılıyor
        limit: req.query.limit,
      };

      const tickets = await TicketService.getAllTickets(filters);

      res.status(200).json({
        success: true,
        tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserTickets(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        category_id: req.query.category_id, // category_id kullanılıyor
        limit: req.query.limit,
      };

      const tickets = await TicketService.getUserTickets(req.user.id, filters);

      res.status(200).json({
        success: true,
        tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  // Kullanıcı kendi ticket detaylarını görüntüleme
  static async getTicketDetails(req, res, next) {
    try {
      const { ticket, messages } = await TicketService.getTicketDetails(
        req.params.id,
        req.user.id // Kullanıcı ID'si gönderilir, sadece kendi ticketlarını görebilir
      );

      res.status(200).json({
        success: true,
        ticket,
        messages,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin tüm ticket detaylarını görüntüleme (YENİ)
  static async getAdminTicketDetails(req, res, next) {
    try {
      const { ticket, messages } = await TicketService.getTicketDetails(
        req.params.id,
        null // null gönderilir, kullanıcı filtresiz tüm ticketları görebilir
      );

      res.status(200).json({
        success: true,
        ticket,
        messages,
      });
    } catch (error) {
      next(error);
    }
  }

  // Admin için ticket atama işlevi
  static async assignTicket(req, res, next) {
    try {
      
      const { user_id } = req.body;
      if (!user_id) {
        throw new ErrorHandler('Görevli ID gereklidir', 400);
      }
      
      // Ticket Service'e atama işlemini ekleyelim
      const ticket = await TicketService.assignTicket(
        req.params.id,
        user_id,
        req.user.id
      );
      
      res.status(200).json({
        success: true,
        message: "Görevli başarıyla atandı",
        ticket
      });
    } catch (error) {
      next(error);
    }
  }

  static async addMessage(req, res, next) {
    try {
      const isAdmin = ["admin", "support"].includes(req.user.role?.name);
      const messages = await TicketMessageService.createMessage(
        req.params.id, 
        req.user.id,
        req.body,
        isAdmin
      );
      
      res.status(201).json({
        success: true,
        message: "Mesaj başarıyla gönderildi",
        messages
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(req, res, next) {
    try {
      const messages = await TicketMessageService.getTicketMessages(
        req.params.id, 
        req.user.id,
      );
      
      res.status(200).json({
        success: true,
        messages
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const ticket = await TicketService.updateTicketStatus(
        req.params.id,
        req.body.status,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: "Talep durumu güncellendi",
        ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await TicketService.getCategories();

      res.status(200).json({
        success: true,
        categories,
      });
    } catch (error) {
      next(error);
    }
  }
  
  static async getCategoryById(req, res, next) {
    try {
      const category = await TicketService.getCategoryById(req.params.id);
      
      res.status(200).json({
        success: true,
        category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markMessageAsRead(req, res, next) {
    try {
      const result = await TicketMessageService.markMessageAsRead(
        req.params.id,
        req.user.id
      );
      
      res.status(200).json({
        success: true,
        message: "Mesaj okundu işaretlendi"
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TicketController;
