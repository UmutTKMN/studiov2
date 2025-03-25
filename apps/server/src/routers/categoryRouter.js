const {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} = require("../api/core");
const { z } = require("zod");
const CategoryService = require("../services/Category.Service");
const categorySchema = require("../schemas/category.schema");

const categoryRouter = router({
  getAll: publicProcedure.query(async () => {
    return await CategoryService.getAllCategories();
  }),

  getById: publicProcedure
    .input(categorySchema.byId)
    .query(async ({ input }) => {
      return await CategoryService.getCategory(input.id);
    }),

  create: adminProcedure
    .input(categorySchema.create)
    .mutation(async ({ input, ctx }) => {
      return await CategoryService.createCategory(input, ctx.user.id);
    }),

  update: adminProcedure
    .input(categorySchema.update)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      return await CategoryService.updateCategory(id, updateData, ctx.user.id);
    }),

  delete: adminProcedure
    .input(categorySchema.delete)
    .mutation(async ({ input, ctx }) => {
      return await CategoryService.deleteCategory(input.id, ctx.user.id);
    }),
});

module.exports = { categoryRouter };
