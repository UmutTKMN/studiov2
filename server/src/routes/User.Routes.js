const express = require("express");
const router = express.Router();
const UserController = require("../controllers/User.Controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const userSchemas = require("../validators/user.validator");
const upload = require("../middleware/upload");

// Public rotalar
router.post("/register", validate(userSchemas.register), UserController.register);
router.post("/login", validate(userSchemas.login), UserController.login);
router.get("/users", UserController.getAllUsers);

// Protected rotalar
router.use(authenticate);

router.post("/logout", authenticate, UserController.logout);

router.get("/profile", UserController.getProfile);
router.put("/profile", 
    validate(userSchemas.updateProfile),
    upload.fields([
        { name: 'profile_picture', maxCount: 1 },
        { name: 'banner_picture', maxCount: 1 }
    ]),
    UserController.updateProfile
);

// Profil fotoğrafı işlemleri
router.post("/profile-picture", 
    upload.single('profile_picture'), 
    UserController.uploadProfilePicture
);

router.post("/banner-picture", 
    upload.single('banner_picture'), 
    UserController.uploadBannerPicture
);

router.delete("/remove-profile-picture", UserController.removeProfilePicture);
router.delete("/remove-banner-picture", UserController.removeBannerPicture);

// Kullanıcı bilgileri
router.get("/:id", UserController.getUserById);

router.get("/login-history", authenticate, UserController.getLoginHistory);

module.exports = router;
