"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { orpcQuery } from "@/lib/orpc";

export function CreatePost() {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const queryClient = useQueryClient();

	const createPostMutation = useMutation(
		orpcQuery.posts.create.mutationOptions({
			onSuccess: () => {
				// Clear form
				setTitle("");
				setBody("");
				// Invalidate posts list to refetch
				queryClient.invalidateQueries({
					queryKey: orpcQuery.posts.list.key(),
				});
			},
			onError: (error) => {
				console.error("Failed to create post:", error);
			},
		}),
	);

	function onCreate() {
		createPostMutation.mutate({ title, body });
	}

	return (
		<div className="space-y-2">
			<input
				className="w-full border p-2"
				placeholder="title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				className="w-full border p-2"
				placeholder="body"
				value={body}
				onChange={(e) => setBody(e.target.value)}
			/>
			<button
				className="rounded border px-3 py-2"
				onClick={onCreate}
				type="button"
				disabled={createPostMutation.isPending}
			>
				{createPostMutation.isPending ? "Creating..." : "Create"}
			</button>
		</div>
	);
}
