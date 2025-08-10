import { Hono } from "hono";
import { generateCombinedSpec, generateScalarHTML } from "../docs";

const docsRoutes = new Hono();

// OpenAPI specification endpoint
docsRoutes.get("/openapi/spec.json", async (c) => {
	try {
		const combinedSpec = await generateCombinedSpec();
		return c.json(combinedSpec);
	} catch (error) {
		console.error("Error generating combined spec:", error);
		return c.json({ error: "Failed to generate combined specification" }, 500);
	}
});

// Scalar UI for combined documentation
docsRoutes.get("/openapi", (c) => {
	const html = generateScalarHTML();
	return c.html(html);
});

export { docsRoutes };
