import * as z from "zod";
import { protectedProcedure } from "../middleware";

export const authRouter = {
	getCurrentUser: protectedProcedure.handler(async ({ context }) => {
		return context.user;
	}),

	getUserProfile: protectedProcedure
		.input(
			z.object({
				userId: z.string().min(1, "User ID is required"),
			}),
		)
		.handler(async ({ context, input }) => {
			// Users can only access their own profile or this could be expanded with admin checks
			if (context.user?.id !== input.userId) {
				throw new Error("FORBIDDEN");
			}

			// This is a basic implementation - you might want to fetch from user table
			return context.user;
		}),
};
