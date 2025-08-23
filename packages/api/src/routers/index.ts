import { publicProcedure } from "../middleware";
import { authRouter } from "./auth";
import { postsRouter } from "./posts";

export const router = {
	healthCheck: publicProcedure.handler(() => {
		return "OK";
	}),
	auth: authRouter,
	posts: postsRouter,
};

export type AppRouter = typeof router;
