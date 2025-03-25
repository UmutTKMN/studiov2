const { z } = require("zod");

const postSchema = {
  // Liste sorgusu için schema
  list: z
    .object({
      limit: z.number().min(1).max(100).optional().default(10),
      cursor: z.string().optional(),
      category_id: z.string().optional(),
    })
    .optional(),

  // Detay sorgusu
  byId: z.object({
    id: z.string(),
  }),

  // Oluşturma işlemi
  create: z.object({
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
    content: z.string().min(10, "İçerik en az 10 karakter olmalıdır"),
    category_id: z.string(),
    image: z.string().optional(),
    is_published: z.boolean().optional().default(true),
  }),

  // Güncelleme işlemi
  update: z.object({
    id: z.string(),
    title: z.string().min(3, "Başlık en az 3 karakter olmalıdır").optional(),
    content: z
      .string()
      .min(10, "İçerik en az 10 karakter olmalıdır")
      .optional(),
    category_id: z.string().optional(),
    image: z.string().optional(),
    is_published: z.boolean().optional(),
  }),

  // Silme işlemi
  delete: z.object({
    id: z.string(),
  }),
};

module.exports = postSchema;
