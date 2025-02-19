const express = require("express");
const router = express.Router();
const PostController = require("../controllers/Post.Controller");
const { authenticate } = require("../middleware/auth");
const validate = require("../middleware/validate");
const postSchemas = require("../validators/post.validator");
const upload = require("../middleware/upload");

// Public rotalar
router.get("/", validate(postSchemas.filter), PostController.getAllPosts);
router.get("/:slug", PostController.getPostBySlug);
router.get(
  "/user/:userId",
  validate(postSchemas.filter),
  PostController.getUserPosts
);
router.get(
  "/category/:categoryId",
  validate(postSchemas.filter),
  PostController.getPostsByCategory
);
router.get("/search", validate(postSchemas.search), PostController.searchPosts);

// Protected rotalar - authenticate middleware'ini buraya taşı
router.use(authenticate);

// Post oluşturma, güncelleme ve silme işlemleri için
router.post(
  "/",
  validate(postSchemas.create),
  upload.single("post_image"),
  PostController.createPost
);

router.put(
  "/:id",
  validate(postSchemas.update),
  upload.single("post_image"),
  PostController.updatePost
);

router.delete("/:id", PostController.deletePost);

module.exports = router;
