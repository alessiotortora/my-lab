import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouter } from "@repo/api";

const link = new RPCLink({
	url: process.env.NEXT_PUBLIC_API_URL
		? `${process.env.NEXT_PUBLIC_API_URL}/rpc`
		: "http://localhost:4000/rpc",
	// include cookies while dev is 3000 -> 4000
	fetch: (input, init) => fetch(input, { ...init, credentials: "include" }),
});

const client: RouterClient<AppRouter> = createORPCClient(link);

// For server-side usage (like in your current page.tsx)
export const orpc = client;

// For client-side TanStack Query usage
export const orpcQuery = createTanstackQueryUtils(client);
