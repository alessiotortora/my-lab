"use client";

import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerificationSuccessPage() {
	const router = useRouter();

	useEffect(() => {
		// Auto redirect to dashboard after 3 seconds
		const timer = setTimeout(() => {
			router.push("/dashboard");
		}, 3000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Card className="w-full max-w-lg">
				<CardHeader className="text-center">
					<CardTitle>Email Verified Successfully!</CardTitle>
					<CardDescription>
						Your email has been verified and you're now signed in.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
						✅ Your email has been verified successfully!
					</div>

					<p className="mb-4 text-gray-600 text-sm">
						You will be redirected to your dashboard in a few seconds...
					</p>

					<Button onClick={() => router.push("/dashboard")} className="w-full">
						Go to Dashboard Now
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
