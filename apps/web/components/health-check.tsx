"use client";

import { useQuery } from "@tanstack/react-query";
import { orpcQuery } from "@/lib/orpc";

export function HealthCheck() {
	const {
		data: health,
		isLoading,
		error,
		refetch,
	} = useQuery(orpcQuery.healthCheck.queryOptions());

	if (isLoading) {
		return <div className="text-blue-600">🔄 Checking server health...</div>;
	}

	if (error) {
		return (
			<div className="text-red-600">
				❌ Health check failed: {error.message}
				<button
					type="button"
					onClick={() => refetch()}
					className="ml-2 text-sm underline"
				>
					Retry
				</button>
			</div>
		);
	}

	return <div className="text-green-600">✅ Server is healthy: {health}</div>;
}
