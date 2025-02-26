const express = require('express');
const router = express.Router();
const TicketCategoryController = require('../controllers/TicketCategory.Controller');
const { authenticate } = require('../middleware/auth');
const validate = require("../middleware/validate");
const categorySchemas = require('../validators/ticketCategory.validator');

router.use(authenticate);

router.get('/', TicketCategoryController.getCategories);

// Admin rotaları
router.post('/', validate(categorySchemas.create), TicketCategoryController.createCategory);
router.put('/:id', validate(categorySchemas.update), TicketCategoryController.updateCategory);
router.delete('/:id', TicketCategoryController.deleteCategory);

module.exports = router;