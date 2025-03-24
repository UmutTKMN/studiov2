const { router, publicProcedure } = require("../api/core");
const { postRouter } = require("./postRouter");

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
});

module.exports = { appRouter };
