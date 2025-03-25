const { z } = require("zod");

const categorySchema = {
  // Liste sorgusu için schema
  list: z
    .object({
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
    })
    .optional(),

  // Detay sorgusu
  byId: z.object({
    id: z.string(),
  }),

  // Oluşturma işlemi
  create: z.object({
    name: z.string().min(3, "Kategori adı en az 3 karakter olmalıdır"),
    description: z.string().optional(),
  }),

  // Güncelleme işlemi
  update: z.object({
    id: z.string(),
    name: z
      .string()
      .min(3, "Kategori adı en az 3 karakter olmalıdır")
      .optional(),
    description: z.string().optional(),
  }),

  // Silme işlemi
  delete: z.object({
    id: z.string(),
  }),
};

module.exports = categorySchema;
