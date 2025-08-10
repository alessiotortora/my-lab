import { Hono } from "hono";
import type { Variables } from "../utils";

const apiRoutes = new Hono<{ Variables: Variables }>();

// Health check endpoint
apiRoutes.get("/health", (c) => c.json({ ok: true }));

// User info endpoint
apiRoutes.get("/me", (c) => {
	const user = c.get("user");
	const session = c.get("session");
	if (!user || !session) {
		return c.json({ message: "Not authenticated", user: null, session: null });
	}
	return c.json({
		user: { id: user.id, email: user.email ?? null },
		session: { id: session.id, expiresAt: session.expiresAt.toISOString() },
	});
});

export { apiRoutes };
