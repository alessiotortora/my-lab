import { os } from "@orpc/server";
import type { AppContext } from "../types";

// Base builder with shared context
export const base = os.$context<AppContext>();

/**
 * Middleware that requires user authentication
 * Throws error if user is not authenticated
 */
export const requireAuth = base.use(async ({ context, next }) => {
	if (!context.user) {
		return Promise.reject(new Error("UNAUTHORIZED"));
	}
	return next();
});
