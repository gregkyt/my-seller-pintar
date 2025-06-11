import { z } from "zod";

const RegisterSchema = z.object({
  username: z.string().min(1, { message: "Username field cannot be empty" }),
  password: z
    .string()
    .min(1, { message: "Password must be at least 8 characters long" }),
  role: z.string().min(1, { message: "Required" }),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export { RegisterSchema, type RegisterFormData };
