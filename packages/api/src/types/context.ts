import type { db, postsTable, user } from "@repo/db";

// Use Drizzle's inferred types directly
export type User = typeof user.$inferSelect;

export type AppContext = {
	db: typeof db;
	user: User | null;
	tables: {
		posts: typeof postsTable;
		users: typeof user;
	};
};
