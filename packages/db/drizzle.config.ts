import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: ["./src/schema/auth.ts", "./src/schema/core.ts"],
	out: "./migrations",
	dialect: "postgresql",
	dbCredentials: {
		url:
			process.env.DATABASE_URL ||
			"postgresql://postgres:postgres@127.0.0.1:54322/postgres",
	},
});
