import type { user } from "@repo/db";

// Use Drizzle's inferred types directly
export type User = typeof user.$inferSelect;

export type AppContext = {
	user: User | null;
};
