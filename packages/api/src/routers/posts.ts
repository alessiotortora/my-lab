import { and, eq } from "drizzle-orm";
import * as z from "zod";
import { base, requireAuth } from "../middleware";

export const listPosts = base.handler(async ({ context }) => {
	const { db, tables } = context;
	const rows = await db.select().from(tables.posts);
	return rows;
});

export const createPost = requireAuth
	.input(
		z.object({
			title: z.string().min(1, "Title is required"),
			body: z.string().min(1, "Body is required"),
		}),
	)
	.handler(async ({ context, input }) => {
		const { db, tables, user } = context;
		const [row] = await db
			.insert(tables.posts)
			.values({
				userId: user?.id || "",
				title: input.title,
				content: input.body,
			})
			.returning();
		return row;
	});

export const deletePost = requireAuth
	.input(
		z.object({
			id: z.number().int().positive("Post ID must be a positive integer"),
		}),
	)
	.handler(async ({ context, input }) => {
		const { db, tables, user } = context;
		const [deletedRow] = await db
			.delete(tables.posts)
			.where(
				// Only allow users to delete their own posts
				and(
					eq(tables.posts.id, input.id),
					eq(tables.posts.userId, user?.id || ""),
				),
			)
			.returning();

		if (!deletedRow) {
			return Promise.reject(new Error("Post not found or not authorized"));
		}

		return deletedRow;
	});

export const postsRouter = {
	list: listPosts,
	create: createPost,
	delete: deletePost,
};
