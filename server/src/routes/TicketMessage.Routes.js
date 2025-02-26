const express = require('express');
const router = express.Router();
const TicketMessageController = require('../controllers/TicketMessage.Controller');
const { authenticate, checkRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const messageSchemas = require('../validators/ticketMessage.validator');

router.use(authenticate);

// Normal kullanıcı ve destek ekibi rotaları
router.post('/:ticketId/messages', validate(messageSchemas.create), TicketMessageController.createMessage);
router.get('/:ticketId/messages', TicketMessageController.getMessages);

// Destek ekibi rotaları
router.patch('/messages/:messageId/read', checkRole(["admin", "support"]), TicketMessageController.markAsRead);

module.exports = router;