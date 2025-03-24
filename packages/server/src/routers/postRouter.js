const {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} = require("../api/core");
const { z } = require("zod");
const PostService = require("../services/Post.Service");

const postRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          limit: z.number().optional(),
          cursor: z.string().optional(),
          category_id: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return await PostService.getAllPosts(input);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await PostService.getPostById(input.id);
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        content: z.string().min(10),
        category_id: z.string(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await PostService.createPost({
        ...input,
        user_id: ctx.user.id,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(3).optional(),
        content: z.string().min(10).optional(),
        category_id: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await PostService.updatePost(input.id, input, ctx.user);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await PostService.deletePost(input.id, ctx.user);
    }),
});

module.exports = { postRouter };
