const express = require("express");
const router = express.Router();
const PostController = require("../controllers/Post.Controller");
const { authenticate, checkRole } = require("../middleware/auth");
const validate = require("../middleware/validate");
const postSchemas = require("../validators/post.validator");

// Public routes
router.get("/", PostController.getAllPosts);
router.get("/:identifier", PostController.getPost);

// Protected routes
router.use(authenticate);

// Editor ve Admin rotaları
router.post("/", checkRole(["admin", "editor"]), validate(postSchemas.create), PostController.createPost);
router.put("/:identifier", checkRole(["admin", "editor"]), validate(postSchemas.update), PostController.updatePost);
router.delete("/:identifier", checkRole(["admin"]), PostController.deletePost);

module.exports = router;
