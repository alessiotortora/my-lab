import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
				gcTime: 1000 * 60 * 60 * 24, // 24 hours
			},
		},
	});
}
