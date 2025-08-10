import { router } from "@repo/api";
import { auth } from "../auth";

/**
 * Helper function to add proper tags to OpenAPI paths
 */
function addTagsToPaths(
	paths: Record<string, unknown>,
	tagName: string,
): Record<string, unknown> {
	const taggedPaths: Record<string, unknown> = {};
	for (const [path, methods] of Object.entries(paths || {})) {
		taggedPaths[path] = {};
		if (methods && typeof methods === "object") {
			for (const [method, spec] of Object.entries(
				methods as Record<string, unknown>,
			)) {
				taggedPaths[path] = {
					...(taggedPaths[path] as Record<string, unknown>),
					[method]: {
						...(spec as Record<string, unknown>),
						tags: [tagName],
					},
				};
			}
		}
	}
	return taggedPaths;
}

/**
 * Generate combined OpenAPI specification for both Better Auth and oRPC
 */
export async function generateCombinedSpec() {
	// Get Better Auth spec
	const authSpec = await auth.api.generateOpenAPISchema();

	// Create a separate OpenAPIGenerator for oRPC (avoid circular calls)
	const { OpenAPIGenerator } = await import("@orpc/openapi");
	const { ZodToJsonSchemaConverter } = await import("@orpc/zod");

	const generator = new OpenAPIGenerator({
		schemaConverters: [new ZodToJsonSchemaConverter()],
	});

	// Generate oRPC spec directly
	const orpcSpec = await generator.generate(router, {
		info: {
			title: "oRPC API",
			version: "1.0.0",
		},
		servers: [{ url: "/rpc" }],
	});

	// Add proper tags and fix paths
	const taggedAuthPaths = addTagsToPaths(
		authSpec.paths || {},
		"Authentication",
	);

	// Add /rpc prefix to oRPC paths and tag them
	const orpcPathsWithPrefix: Record<string, unknown> = {};
	for (const [path, methods] of Object.entries(orpcSpec.paths || {})) {
		orpcPathsWithPrefix[`/rpc${path}`] = methods;
	}
	const taggedOrpcPaths = addTagsToPaths(orpcPathsWithPrefix, "oRPC");

	// Combine specifications with proper tags
	return {
		openapi: "3.0.0",
		info: {
			title: "my-lab Complete API",
			version: "1.0.0",
			description:
				"Combined API documentation for Better Auth authentication and oRPC endpoints",
		},
		servers: [{ url: "http://localhost:4000" }],
		paths: {
			...taggedAuthPaths,
			...taggedOrpcPaths,
		},
		components: {
			schemas: {
				...authSpec.components?.schemas,
				...orpcSpec.components?.schemas,
			},
			securitySchemes: {
				...authSpec.components?.securitySchemes,
				...orpcSpec.components?.securitySchemes,
			},
		},
		tags: [
			{
				name: "Authentication",
				description:
					"Better Auth endpoints for user authentication and session management",
			},
			{
				name: "oRPC",
				description: "oRPC endpoints for application business logic",
			},
			...(orpcSpec.tags || []).filter(
				(tag: { name: string }) =>
					!["Authentication", "oRPC"].includes(tag.name),
			),
		],
	};
}
