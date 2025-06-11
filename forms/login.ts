import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().min(1, { message: "Please enter your username" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export { LoginSchema, type LoginFormData };
