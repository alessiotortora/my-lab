import { Button } from "@repo/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { orpcQuery } from "../lib/orpc";

export const Route = createFileRoute("/api-demo")({
	component: ApiDemo,
});

function ApiDemo() {
	const {
		data: healthCheck,
		isLoading: healthLoading,
		error: healthError,
		refetch: refetchHealth,
	} = useQuery(orpcQuery.healthCheck.queryOptions());

	const {
		data: posts,
		isLoading: postsLoading,
		error: postsError,
		refetch: refetchPosts,
	} = useQuery(orpcQuery.posts.list.queryOptions());

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="mx-auto max-w-4xl space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>API Connection Demo</CardTitle>
						<CardDescription>
							Testing connection to your ORPC API server on port 4000
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Health Check */}
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">Health Check</h3>
							{healthLoading && <p>Loading health check...</p>}
							{healthError && (
								<p className="text-destructive">Error: {healthError.message}</p>
							)}
							{healthCheck && (
								<div className="rounded-md border border-green-200 bg-green-50 p-4">
									<p className="text-green-800">✅ API Connected!</p>
									<p className="text-green-600 text-sm">
										Health check: {healthCheck}
									</p>
								</div>
							)}
							<Button onClick={() => refetchHealth()} size="sm">
								Refresh Health
							</Button>
						</div>

						{/* Posts List */}
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">Posts List</h3>
							{postsLoading && <p>Loading posts...</p>}
							{postsError && (
								<p className="text-destructive">Error: {postsError.message}</p>
							)}
							{posts && (
								<div className="space-y-2">
									<p className="text-muted-foreground text-sm">
										Found {posts.length} posts
									</p>
									{posts.length > 0 ? (
										<div className="space-y-2">
											{posts.map((post: any) => (
												<div key={post.id} className="rounded-md border p-3">
													<h4 className="font-medium">{post.title}</h4>
													<p className="text-muted-foreground text-sm">
														{post.content}
													</p>
													<p className="text-muted-foreground text-xs">
														ID: {post.id}
													</p>
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground text-sm">
											No posts found
										</p>
									)}
								</div>
							)}
							<Button onClick={() => refetchPosts()} size="sm">
								Refresh Posts
							</Button>
						</div>

						{/* Available Routes */}
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">Available API Routes</h3>
							<div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
								<div className="rounded bg-muted p-2">
									<code>healthCheck</code> - Server health check
								</div>
								<div className="rounded bg-muted p-2">
									<code>posts.list</code> - Get all posts
								</div>
								<div className="rounded bg-muted p-2">
									<code>posts.create</code> - Create post (protected)
								</div>
								<div className="rounded bg-muted p-2">
									<code>posts.delete</code> - Delete post (protected)
								</div>
								<div className="rounded bg-muted p-2">
									<code>auth.*</code> - Authentication routes
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
