"use server";

import { SignUpSchema, SignUpType } from "../schemas";
import { hashPassword } from "../auth";
import { prisma } from "../prisma";

export async function signUpUser(data: SignUpType) {
  const validationResult = SignUpSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Invalid sign-up data.",
      issues: validationResult.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validationResult.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists.",
      };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    };
  } catch (error) {
    console.error("Error signing up user:", error);
    return {
      success: false,
      error: "Could not create account.",
    };
  }
}
