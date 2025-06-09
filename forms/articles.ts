import { z } from "zod";

const ArticlesSchema = z.object({
  title: z.string(),
  category: z.string(),
});

const ArticleSchema = z.object({
  title: z.string().min(1, { message: "Required " }),
  content: z.string().min(1, { message: "Required " }),
  categoryId: z.string().min(1, { message: "Required " }),
});

type ArticlesFormData = z.infer<typeof ArticlesSchema>;
type ArticleFormData = z.infer<typeof ArticleSchema>;

export {
  ArticleSchema,
  ArticlesSchema,
  type ArticleFormData,
  type ArticlesFormData,
};
