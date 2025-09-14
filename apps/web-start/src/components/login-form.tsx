import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { cn } from "@repo/ui/lib/utils";
import { useId, useState } from "react";
import { authClient, sendVerificationEmail } from "../lib/auth-client";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [verificationEmailSent, setVerificationEmailSent] = useState(false);
	const [isResendingEmail, setIsResendingEmail] = useState(false);

	// Generate unique IDs for form elements
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			if (isSignUp) {
				await authClient.signUp.email(
					{
						email,
						password,
						name,
						callbackURL: "/dashboard",
					},
					{
						onRequest: () => {
							setIsLoading(true);
						},
						onSuccess: () => {
							// Show verification email sent message instead of redirecting
							setVerificationEmailSent(true);
							setIsLoading(false);
						},
						onError: (ctx) => {
							setError(ctx.error.message);
							setIsLoading(false);
						},
					},
				);
			} else {
				await authClient.signIn.email(
					{
						email,
						password,
						callbackURL: "/dashboard",
						rememberMe: true,
					},
					{
						onRequest: () => {
							setIsLoading(true);
						},
						onSuccess: () => {
							window.location.href = "/dashboard";
						},
						onError: (ctx) => {
							// Handle email not verified error
							if (
								ctx.error.message?.includes("email") &&
								ctx.error.message?.includes("verified")
							) {
								setError(
									"Please verify your email address before signing in. Check your inbox for a verification link.",
								);
							} else {
								setError(ctx.error.message);
							}
							setIsLoading(false);
						},
					},
				);
			}
		} catch {
			setError("An unexpected error occurred");
			setIsLoading(false);
		}
	};

	const handleResendVerification = async () => {
		setIsResendingEmail(true);
		setError("");

		try {
			await sendVerificationEmail(
				{ email },
				{
					onSuccess: () => {
						setError("");
						setIsResendingEmail(false);
					},
					onError: (ctx) => {
						setError(
							ctx.error.message || "Failed to resend verification email",
						);
						setIsResendingEmail(false);
					},
				},
			);
		} catch {
			setError("Failed to resend verification email");
			setIsResendingEmail(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>
						{isSignUp ? "Create an account" : "Login to your account"}
					</CardTitle>
					<CardDescription>
						{isSignUp
							? "Enter your details below to create your account"
							: "Enter your email below to login to your account"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{verificationEmailSent ? (
						<div className="space-y-4 text-center">
							<div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
								✅ Verification email sent to {email}
							</div>
							<p className="text-gray-600 text-sm">
								Please check your email and click the verification link to
								complete your registration.
							</p>
							<div className="flex flex-col gap-3">
								<Button
									onClick={handleResendVerification}
									variant="outline"
									disabled={isResendingEmail}
									className="w-full"
								>
									{isResendingEmail
										? "Sending..."
										: "Resend verification email"}
								</Button>
								<Button
									onClick={() => {
										setVerificationEmailSent(false);
										setIsSignUp(false);
										setError("");
									}}
									variant="ghost"
									className="w-full"
								>
									Back to sign in
								</Button>
							</div>
							{error && (
								<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
									{error}
								</div>
							)}
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<div className="flex flex-col gap-6">
								{error && (
									<div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
										{error}
									</div>
								)}

								{isSignUp && (
									<div className="grid gap-3">
										<Label htmlFor={nameId}>Name</Label>
										<Input
											id={nameId}
											type="text"
											placeholder="John Doe"
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
								)}

								<div className="grid gap-3">
									<Label htmlFor={emailId}>Email</Label>
									<Input
										id={emailId}
										type="email"
										placeholder="m@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</div>

								<div className="grid gap-3">
									<div className="flex items-center">
										<Label htmlFor={passwordId}>Password</Label>
										{!isSignUp && (
											<button
												type="button"
												className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
											>
												Forgot your password?
											</button>
										)}
									</div>
									<Input
										id={passwordId}
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={8}
									/>
									{isSignUp && (
										<p className="text-gray-500 text-xs">
											Password must be at least 8 characters long
										</p>
									)}
								</div>

								<div className="flex flex-col gap-3">
									<Button type="submit" className="w-full" disabled={isLoading}>
										{isLoading
											? "Please wait..."
											: isSignUp
												? "Sign up"
												: "Login"}
									</Button>
									<Button variant="outline" className="w-full" type="button">
										Login with Google
									</Button>
								</div>
							</div>

							<div className="mt-4 text-center text-sm">
								{isSignUp
									? "Already have an account? "
									: "Don't have an account? "}
								<button
									type="button"
									onClick={() => {
										setIsSignUp(!isSignUp);
										setError("");
										setEmail("");
										setPassword("");
										setName("");
									}}
									className="underline underline-offset-4"
								>
									{isSignUp ? "Sign in" : "Sign up"}
								</button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
