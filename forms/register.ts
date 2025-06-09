import { z } from "zod";

const RegisterSchema = z.object({
  username: z.string().min(1, { message: "Required" }),
  password: z.string().min(1, { message: "Required" }),
  role: z.string().min(1, { message: "Required" }),
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

export { RegisterSchema, type RegisterFormData };
