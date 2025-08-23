import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig, serverConfig } from "./config";
import { rpcMiddleware, sessionMiddleware } from "./middleware";
import { authRoutes, docsRoutes } from "./routes";
import type { Variables } from "./utils";

const app = new Hono<{ Variables: Variables }>();

app.use("*", logger());
// 1) CORS FIRST (so /api/auth preflights work)
app.use("*", cors(corsConfig));

// 2) Better Auth routes
app.route("/", authRoutes);

// 3) Session middleware for all subsequent routes
app.use("*", sessionMiddleware);

// 4) oRPC middleware at /rpc
app.use("/rpc/*", rpcMiddleware);

// 5) Documentation routes
app.route("/", docsRoutes);

export default {
	port: serverConfig.port,
	fetch: app.fetch,
};
