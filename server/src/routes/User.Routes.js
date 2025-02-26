const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const userSchemas = require("../validators/user.validator");

// Public routes
router.post(
  "/register",
  validate(userSchemas.register),
  UserController.register
);
router.post("/login", validate(userSchemas.login), UserController.login);

// Protected routes - Tüm kullanıcılar
router.use(authenticate);

// Kullanıcı profil işlemleri - Authenticated
router.get("/profile", UserController.getProfile);
router.put(
  "/profile",
  validate(userSchemas.updateProfile),
  UserController.updateProfile
);
router.post(
  "/change-password",
  validate(userSchemas.changePassword),
  UserController.changePassword
);
router.post("/logout", UserController.logout);

// Admin routes - Sadece admin yetkisi olanlar
router.get("/users", checkRole(["admin"]), UserController.getAllUsers);
router.get(
  "/login-history",
  checkRole(["admin"]),
  UserController.getLoginHistory
);
// Admin kullanıcılarını getir
router.get("/staff-teams", checkRole(["admin"]), UserController.getAdminUsers);

router.get("/:id", checkRole(["admin"]), UserController.getUserById);

module.exports = router;
