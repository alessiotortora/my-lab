import { account, db, session, user, verification } from "@repo/db";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";
import { sendVerificationEmail } from "./utils/email";

export const auth: ReturnType<typeof betterAuth> = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
	secret: process.env.BETTER_AUTH_SECRET || "your-secret-key",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	trustedOrigins: [
		process.env.FRONTEND_URL || "http://localhost:3000",
		process.env.BETTER_AUTH_URL || "http://localhost:4000",
	],
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({
			user,
			url,
		}: {
			user: { id: string; email: string; name: string };
			url: string;
		}) => {
			try {
				// Extract token from the original URL
				const urlObj = new URL(url);
				const token = urlObj.searchParams.get("token");

				// Set callback URL to frontend dashboard
				const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
				const backendUrl =
					process.env.BETTER_AUTH_URL || "http://localhost:4000";

				// Build verification URL that goes to backend but redirects to frontend after success
				const verificationUrl = `${backendUrl}/api/auth/verify-email?token=${token}&callbackURL=${encodeURIComponent(`${frontendUrl}/verification-success`)}`;

				await sendVerificationEmail(user.email, verificationUrl, user.name);
				console.log(`Verification email sent to ${user.email}`);
			} catch (error) {
				console.error("Failed to send verification email:", error);
				throw new Error("Failed to send verification email");
			}
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
	},
	plugins: [openAPI()],
} satisfies BetterAuthOptions);
