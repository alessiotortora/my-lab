import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouter } from "@repo/api";

const link = new RPCLink({
	url: "http://localhost:3000/rpc",
	fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
});

const client: RouterClient<AppRouter> = createORPCClient(link);

// For server-side usage (like in your current page.tsx)
export const orpc = client;

// For client-side TanStack Query usage
export const orpcQuery = createTanstackQueryUtils(client);
