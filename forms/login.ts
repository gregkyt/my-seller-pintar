import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export { LoginSchema, type LoginFormData };
