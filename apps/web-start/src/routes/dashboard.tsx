import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
	beforeLoad: async () => {
		// This would need to be implemented with server-side session checking
		// For now, we'll handle it client-side
	},
});

function Dashboard() {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background p-4">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
						<CardDescription>
							You need to be logged in to access this page.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<a href="/login">Go to Login</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="mx-auto max-w-4xl">
				<Card>
					<CardHeader>
						<CardTitle>Dashboard</CardTitle>
						<CardDescription>
							Welcome back, {session.user.name}!
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<p>
								<strong>Email:</strong> {session.user.email}
							</p>
							<p>
								<strong>ID:</strong> {session.user.id}
							</p>
							<p>
								<strong>Verified:</strong>{" "}
								{session.user.emailVerified ? "Yes" : "No"}
							</p>
						</div>
						<Button
							onClick={() => {
								// Add logout functionality
								window.location.href = "/login";
							}}
							variant="outline"
						>
							Logout
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
