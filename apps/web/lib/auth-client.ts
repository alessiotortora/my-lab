import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: "http://localhost:4000",
});

// Export the methods from the configured client
export const { signIn, signUp, useSession } = authClient;
