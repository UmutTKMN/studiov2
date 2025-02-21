const express = require("express");
const router = express.Router();
const FeedbackController = require("../controllers/Feedback.Controller");
const { authenticate } = require("../../middleware/auth");
const validate = require("../../middleware/validate");
const feedbackSchemas = require("../validations/feedback.validation");
const admin = require("../../middleware/admin");

// Public rotalar
router.get("/", validate(feedbackSchemas.filter), FeedbackController.getAllFeedbacks);
router.get("/:id", FeedbackController.getFeedback);
router.post("/", validate(feedbackSchemas.create), FeedbackController.createFeedback);
router.get("/search", validate(feedbackSchemas.search), FeedbackController.searchFeedbacks);

// Protected rotalar (Admin only)
router.use(authenticate, admin);
router.put("/:id", validate(feedbackSchemas.update), FeedbackController.updateFeedback);
router.delete("/:id", FeedbackController.deleteFeedback);
router.get("/stats/all", FeedbackController.getFeedbackStats);
router.get("/type/:type", FeedbackController.getFeedbacksByType);
router.get("/email/search", FeedbackController.getFeedbacksByEmail);

module.exports = router;
