import { createOpenAPI } from "fumadocs-openapi/server";

export const openapi = createOpenAPI({
	// Use the local OpenAPI schema file
	input: ["./openapi-spec.json"],
});
