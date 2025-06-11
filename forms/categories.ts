import { z } from "zod";

const CategoriesSchema = z.object({
  search: z.string(),
});

const CategorySchema = z.object({
  name: z.string().min(1, { message: "Category field cannot be empty" }),
});

type CategoriesFormData = z.infer<typeof CategoriesSchema>;
type CategoryFormData = z.infer<typeof CategorySchema>;

export {
  CategoriesSchema,
  CategorySchema,
  type CategoriesFormData,
  type CategoryFormData,
};
