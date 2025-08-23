import { ORPCError, os } from "@orpc/server";
import type { AppContext } from "../types";

export const o = os.$context<AppContext>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
	if (!context.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			user: context.user,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);
