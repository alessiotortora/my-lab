import { db, postsTable } from "@repo/db";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// allow your Next dev origin so the web app can call this API later
app.use(
	"*",
	cors({
		origin: ["http://localhost:3000"],
		allowMethods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.get("/health", (c) => c.json({ ok: true }));

app.get("/posts", async (c) => {
	const rows = await db.select().from(posts);
	return c.json(rows);
});

// Bun style: export fetch + port
export default {
	port: 4000,
	fetch: app.fetch,
};
