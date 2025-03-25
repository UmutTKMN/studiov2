const { router, publicProcedure } = require("../api/core");
const { postRouter } = require("./postRouter");
const { categoryRouter } = require("./categoryRouter");

const appRouter = router({
  health: router({
    check: publicProcedure.query(() => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
      };
    }),
  }),
  post: postRouter,
  category: categoryRouter,
});

module.exports = { appRouter };
