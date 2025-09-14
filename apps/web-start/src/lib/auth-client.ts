import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	/** The base URL of the server */
	baseURL: "http://localhost:4000/api/auth", // Your server runs on port 4000
});

// Export the methods from the configured client
export const {
	signIn,
	signUp,
	useSession,
	verifyEmail,
	sendVerificationEmail,
} = authClient;
