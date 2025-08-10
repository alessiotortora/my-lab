/**
 * Generate Scalar UI HTML for API documentation
 */
export function generateScalarHTML(): string {
	return `
<!DOCTYPE html>
<html>
<head>
    <title>my-lab API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="https://orpc.unnoq.com/icon.svg" />
</head>
<body>
    <div id="app"></div>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
        Scalar.createApiReference('#app', {
            url: '/openapi/spec.json',
            authentication: {
                securitySchemes: {
                    bearerAuth: {
                        token: 'your-token-here',
                    },
                },
            },
        })
    </script>
</body>
</html>
	`;
}
