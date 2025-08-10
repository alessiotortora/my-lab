import { account, db, session, user, verification } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
	baseURL: "http://localhost:4000",
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user,
			session,
			account,
			verification,
		},
	}),
	trustedOrigins: ["http://localhost:3000", "http://localhost:4000"],
	emailAndPassword: {
		enabled: true,
		autoSignIn: true, // automatically sign in users after sign up
	},
	plugins: [openAPI()],
});
