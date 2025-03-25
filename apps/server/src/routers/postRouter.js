const {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} = require("../api/core");
const PostService = require("../services/Post.Service");
const postSchema = require("../schemas/post.schema");

const postRouter = router({
  getAll: publicProcedure.input(postSchema.list).query(async ({ input }) => {
    return await PostService.getAllPosts(input || {});
  }),

  getById: publicProcedure.input(postSchema.byId).query(async ({ input }) => {
    return await PostService.getPostById(input.id);
  }),

  create: protectedProcedure
    .input(postSchema.create)
    .mutation(async ({ input, ctx }) => {
      return await PostService.createPost({
        title: input.title,
        content: input.content,
        category_id: input.category_id,
        image: input.image,
        is_published: input.is_published,
        user_id: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(postSchema.update)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      return await PostService.updatePost(id, updateData, ctx.user);
    }),

  delete: protectedProcedure
    .input(postSchema.delete)
    .mutation(async ({ input, ctx }) => {
      return await PostService.deletePost(input.id, ctx.user);
    }),
});

module.exports = { postRouter };
