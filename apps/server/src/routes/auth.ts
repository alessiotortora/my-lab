import { Hono } from "hono";
import { auth } from "../auth";
import type { Variables } from "../utils";

const authRoutes = new Hono<{ Variables: Variables }>();

// Better Auth handler (single * wildcard)
authRoutes.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export { authRoutes };
