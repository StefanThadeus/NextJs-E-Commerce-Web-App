import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email({
    error: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    error: "Password must be at least 8 characters long.",
  }),
});

export type SignInType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z
  .object({
    name: z.string().min(2, {
      error: "Name must be at least 2 characters long.",
    }),
    email: z.email({
      error: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      error: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z.string().min(8, {
      error: "Confirm Password must be at least 8 characters long.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpType = z.infer<typeof SignUpSchema>;
