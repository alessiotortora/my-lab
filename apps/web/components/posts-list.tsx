"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpcQuery } from "@/lib/orpc";

type Post = {
	title: string;
	content: string;
	id: number;
};

export function PostsList() {
	const queryClient = useQueryClient();
	const {
		data: posts,
		isLoading,
		error,
	} = useQuery(orpcQuery.posts.list.queryOptions());

	const deletePostMutation = useMutation(
		orpcQuery.posts.delete.mutationOptions({
			onSuccess: () => {
				// Invalidate posts list to refetch
				queryClient.invalidateQueries({
					queryKey: orpcQuery.posts.list.key(),
				});
			},
			onError: (error) => {
				console.error("Failed to delete post:", error);
			},
		}),
	);

	function onDelete(postId: number) {
		if (confirm("Are you sure you want to delete this post?")) {
			deletePostMutation.mutate({ id: postId });
		}
	}

	if (isLoading) {
		return <div>Loading posts...</div>;
	}

	if (error) {
		return <div>Error loading posts: {error.message}</div>;
	}

	return (
		<div>
			<h2 className="mb-4 font-bold text-xl">
				Posts (Live with TanStack Query)
			</h2>
			{posts && posts.length > 0 ? (
				<ul className="space-y-2">
					{posts.map((post: Post) => (
						<li
							key={post.id}
							className="flex items-start justify-between rounded border p-3"
						>
							<div className="flex-1">
								<h3 className="font-semibold">{post.title}</h3>
								<p className="text-gray-600">{post.content}</p>
							</div>
							<button
								type="button"
								onClick={() => onDelete(post.id)}
								disabled={deletePostMutation.isPending}
								className="ml-3 rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600 disabled:opacity-50"
							>
								{deletePostMutation.isPending ? "..." : "Delete"}
							</button>
						</li>
					))}
				</ul>
			) : (
				<p>No posts yet. Create one above!</p>
			)}
		</div>
	);
}
