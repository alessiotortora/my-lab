import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(
	process.env.DATABASE_URL ||
		"postgresql://postgres:postgres@127.0.0.1:54322/postgres",
);
export const db = drizzle({ client });

export * from "./schema";

// Export drizzle-orm operators to avoid version conflicts
export { and, eq };
