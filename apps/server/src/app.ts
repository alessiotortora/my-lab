import { Hono } from "hono";
import { cors } from "hono/cors";
import { corsConfig, serverConfig } from "./config";
import { rpcMiddleware, sessionMiddleware } from "./middleware";
import { apiRoutes, authRoutes, docsRoutes } from "./routes";
import type { Variables } from "./utils";

const app = new Hono<{ Variables: Variables }>();

// 1) CORS FIRST (so /api/auth preflights work)
app.use("*", cors(corsConfig));

// 2) Better Auth routes
app.route("/", authRoutes);

// 3) Session middleware for all subsequent routes
app.use("*", sessionMiddleware);

// 4) oRPC middleware at /rpc
app.use("/rpc/*", rpcMiddleware);

// 5) API routes (health, me, etc.)
app.route("/", apiRoutes);

// 6) Documentation routes
app.route("/", docsRoutes);

export default {
	port: serverConfig.port,
	fetch: app.fetch,
};
