const { initTRPC } = require("@trpc/server");
const superjson = require("superjson");

// tRPC başlatma
const t = initTRPC.context().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        errorCode: error.code,
        timestamp: new Date().toISOString(),
      },
    };
  },
});

// Temel router ve procedure tanımlamaları
const router = t.router;
const publicProcedure = t.procedure;

// Auth middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error("Oturum açmanız gerekiyor");
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Authorized procedure
const protectedProcedure = publicProcedure.use(isAuthed);

// Admin middleware
const isAdmin = isAuthed.unstable_pipe(({ ctx, next }) => {
  if (ctx.user.role?.name !== "admin") {
    throw new Error("Bu işlem için admin yetkisi gerekiyor");
  }
  return next({ ctx });
});

const adminProcedure = publicProcedure.use(isAdmin);

module.exports = {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
  t,
};
