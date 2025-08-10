import { RPCHandler } from "@orpc/server/fetch";
import { type AppContext, router } from "@repo/api";
import { db, postsTable, user } from "@repo/db";
import type { Context, Next } from "hono";
import { auth } from "../auth";

// oRPC body parser proxy (from docs)
const BODY_PARSER_METHODS = new Set([
	"arrayBuffer",
	"blob",
	"formData",
	"json",
	"text",
] as const);

type BodyParserMethod = typeof BODY_PARSER_METHODS extends Set<infer T>
	? T
	: never;

function createRPCHandler() {
	// Create one handler instance (can reuse)
	const handler = new RPCHandler(router);
	return async (request: Request) => {
		// per-request context: fetch session & pass db/tables
		const session = await auth.api.getSession({ headers: request.headers });
		return handler.handle(request, {
			prefix: "/rpc",
			context: {
				db,
				user: session?.user
					? {
							...session.user,
							image: session.user.image ?? null,
						}
					: null,
				tables: {
					posts: postsTable,
					users: user,
				},
			} satisfies AppContext,
		});
	};
}

const rpcHandler = createRPCHandler();

/**
 * Middleware to handle oRPC requests with body parser proxy
 * Prevents "body already used" errors by proxying request methods
 */
export async function rpcMiddleware(c: Context, next: Next) {
	const request = new Proxy(c.req.raw, {
		get(target, prop) {
			if (BODY_PARSER_METHODS.has(prop as BodyParserMethod)) {
				return () => c.req[prop as BodyParserMethod]();
			}
			return Reflect.get(target, prop, target);
		},
	}) as Request;

	const { matched, response } = await rpcHandler(request);
	if (matched) return c.newResponse(response.body, response);
	await next();
}
