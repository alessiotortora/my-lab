import { authRouter } from "./auth";
import { postsRouter } from "./posts";

export const router = {
	auth: authRouter,
	posts: postsRouter,
};

export type AppRouter = typeof router;
