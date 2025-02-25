const express = require("express");
const router = express.Router();
const PostController = require("../controllers/Post.Controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const postSchemas = require("../validators/post.validator");

// Public routes
router.get("/", PostController.getAllPosts);
router.get("/:identifier", PostController.getPost);

// Protected routes
router.use(authenticate);

router.post("/", validate(postSchemas.create), PostController.createPost);
router.put("/:identifier", validate(postSchemas.update), PostController.updatePost);
router.delete("/:identifier", PostController.deletePost);

module.exports = router;
