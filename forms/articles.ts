import { z } from "zod";

const ArticlesSchema = z.object({
  title: z.string(),
  category: z.string(),
});

const ArticleSchema = z.object({
  title: z.string().min(1, { message: "Please enter title" }),
  content: z.string().min(1, { message: "Content field cannot be empty" }),
  categoryId: z.string().min(1, { message: "Please select category" }),
  imageUrl: z.string().url({ message: "Please enter picture" }),
});

type ArticlesFormData = z.infer<typeof ArticlesSchema>;
type ArticleFormData = z.infer<typeof ArticleSchema>;

export {
  ArticleSchema,
  ArticlesSchema,
  type ArticleFormData,
  type ArticlesFormData,
};
