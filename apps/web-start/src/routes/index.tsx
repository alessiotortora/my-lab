import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Welcome to TanStack Start</CardTitle>
					<CardDescription>
						Your TanStack Start app is running with shadcn/ui components from
						your monorepo!
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button className="w-full">Get Started</Button>
					<Button variant="outline" className="w-full" asChild>
						<Link to="/api-demo">Test API Connection</Link>
					</Button>
					<div className="text-center text-muted-foreground text-sm">
						<p>Connected to your monorepo packages:</p>
						<ul className="mt-2 space-y-1">
							<li>✅ @repo/ui (shadcn/ui components)</li>
							<li>✅ @repo/api (ORPC router)</li>
							<li>✅ @repo/typescript-config</li>
							<li>✅ TanStack Query + ORPC</li>
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
