"use client";

import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "../../lib/auth-client";

export default function Dashboard() {
	const { data: session, isPending, error, refetch } = useSession();
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};

	if (isPending) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="mx-auto h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2"></div>
					<p className="mt-2 text-gray-600 text-sm">Loading...</p>
				</div>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Access Denied</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4 text-gray-600 text-sm">
							You need to be logged in to access this page.
						</p>
						<Button onClick={() => router.push("/login")} className="w-full">
							Go to Login
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="mx-auto max-w-4xl px-4">
				<div className="mb-8">
					<h1 className="font-bold text-3xl text-gray-900">Dashboard</h1>
					<p className="text-gray-600">
						Welcome back, {session.user.name || session.user.email}!
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>User Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<span className="font-medium">Name:</span>{" "}
								{session.user.name || "Not provided"}
							</div>
							<div>
								<span className="font-medium">Email:</span> {session.user.email}
							</div>
							<div>
								<span className="font-medium">User ID:</span> {session.user.id}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Session Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<span className="font-medium">Session ID:</span>{" "}
								{session.session.id}
							</div>
							<div>
								<span className="font-medium">Expires:</span>{" "}
								{new Date(session.session.expiresAt).toLocaleString()}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="mt-8 flex justify-end">
					<Button onClick={handleSignOut} variant="outline">
						Sign Out
					</Button>
				</div>
			</div>
		</div>
	);
}
