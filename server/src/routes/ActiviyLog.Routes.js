const express = require("express");
const router = express.Router();
const ActivityLogController = require("../controllers/ActivityLog.Controller");

// Tüm rotalar için auth middleware'i uygula
// Kullanıcı aktivitelerini getir
router.get("/user/:userId", ActivityLogController.getUserActivity);

// Belirli bir tablonun aktivitelerini getir
router.get("/table/:tableName", ActivityLogController.getTableActivity);

// Son aktiviteleri getir
router.get("/recent", ActivityLogController.getRecentActivity);

module.exports = router;
