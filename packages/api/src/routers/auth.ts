import * as z from "zod";
import { requireAuth } from "../middleware";

export const getCurrentUser = requireAuth.handler(async ({ context }) => {
	const { user } = context;
	return user;
});

export const getUserProfile = requireAuth
	.input(
		z.object({
			userId: z.string().min(1, "User ID is required"),
		}),
	)
	.handler(async ({ context, input }) => {
		const { user } = context;

		// Users can only access their own profile or this could be expanded with admin checks
		if (user?.id !== input.userId) {
			return Promise.reject(new Error("FORBIDDEN"));
		}

		// This is a basic implementation - you might want to fetch from user table
		return user;
	});

export const authRouter = {
	getCurrentUser,
	getUserProfile,
};
