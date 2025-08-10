import { PostsList } from "@/components/posts-list";
import { CreatePost } from "./rpctest/create";

export default function Home() {
	return (
		<div className="mx-auto max-w-2xl space-y-8 p-6">
			<h1 className="font-bold text-2xl">oRPC + TanStack Query Demo</h1>

			<div>
				<h2 className="mb-4 font-semibold text-xl">Create New Post</h2>
				<CreatePost />
			</div>

			<PostsList />
		</div>
	);
}
