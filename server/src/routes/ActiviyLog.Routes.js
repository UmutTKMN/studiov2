const express = require("express");
const router = express.Router();
const ActivityLogController = require("../controllers/ActivityLog.Controller");
const { authenticate, checkRole } = require("../middleware/auth");

router.use(authenticate);
router.use(checkRole(["admin"])); // Sadece adminler erişebilir

router.get("/user/:userId", ActivityLogController.getUserActivity);
router.get("/table/:tableName", ActivityLogController.getTableActivity);
router.get("/recent", ActivityLogController.getRecentActivity);

module.exports = router;
