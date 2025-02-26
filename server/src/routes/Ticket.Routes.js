const express = require('express');
const router = express.Router();
const TicketController = require('../controllers/Ticket.Controller');
const { authenticate, checkRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const ticketSchemas = require('../validators/ticket.validator');

router.use(authenticate);

// Normal kullanıcı rotaları
router.post('/', validate(ticketSchemas.create), TicketController.createTicket);
router.get('/my-tickets', TicketController.getUserTickets);
router.get('/categories', TicketController.getCategories);
router.get('/categories/:id', TicketController.getCategoryById); // Yeni rota: kategori detayları
router.get('/user-ticket/:id', TicketController.getTicketDetails); // Kullanıcı kendi ticket'ı
router.post('/:id/messages', validate(ticketSchemas.addMessage), TicketController.addMessage);
router.get('/:id/messages', TicketController.getMessages);
router.patch('/messages/:messageId/read', TicketController.markMessageAsRead);

// Admin rotaları
router.get('/', checkRole(["admin"]), TicketController.getAllTickets);
router.get('/:id', checkRole(["admin"]), TicketController.getAdminTicketDetails); // Admin için tüm ticketlar
router.patch('/:id/status', checkRole(["admin"]), validate(ticketSchemas.updateStatus), TicketController.updateStatus);
// Görevli atama
router.patch('/:id/assign', checkRole(["admin"]), TicketController.assignTicket);

module.exports = router;