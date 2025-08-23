import { and, db, eq, postsTable } from "@repo/db";
import * as z from "zod";
import { protectedProcedure, publicProcedure } from "../middleware";

export const postsRouter = {
	list: publicProcedure.handler(async () => {
		return await db.select().from(postsTable);
	}),

	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1, "Title is required"),
				body: z.string().min(1, "Body is required"),
			}),
		)
		.handler(async ({ context, input }) => {
			const [row] = await db
				.insert(postsTable)
				.values({
					userId: context.user?.id || "",
					title: input.title,
					content: input.body,
				})
				.returning();
			return row;
		}),

	delete: protectedProcedure
		.input(
			z.object({
				id: z.number().int().positive("Post ID must be a positive integer"),
			}),
		)
		.handler(async ({ context, input }) => {
			// First check if the post exists and belongs to the user
			const existingPost = await db
				.select()
				.from(postsTable)
				.where(
					and(
						eq(postsTable.id, input.id),
						eq(postsTable.userId, context.user?.id || ""),
					),
				)
				.limit(1);

			if (!existingPost.length) {
				throw new Error("Post not found or not authorized");
			}

			// Delete the post
			const [deletedRow] = await db
				.delete(postsTable)
				.where(eq(postsTable.id, input.id))
				.returning();

			return deletedRow;
		}),
};
