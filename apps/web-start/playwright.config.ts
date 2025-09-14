import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	outputDir: "../../playwright-artifacts/apps/web-start/test-results",
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI
		? [
				[
					"html",
					{
						open: "never",
						outputFolder:
							"../../playwright-artifacts/apps/web-start/playwright-report",
					},
				],
				["dot"],
			]
		: [
				[
					"html",
					{
						open: "never",
						outputFolder:
							"../../playwright-artifacts/apps/web-start/playwright-report",
					},
				],
				["list"],
			],
	timeout: 30_000,

	use: {
		baseURL: "http://localhost:3001",
		trace: "retain-on-failure",
		video: "retain-on-failure",
		screenshot: "only-on-failure",
	},

	webServer: {
		command: "bun run dev",
		url: "http://localhost:3001",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		...(process.env.CI
			? [
					{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
					{ name: "webkit", use: { ...devices["Desktop Safari"] } },
				]
			: []),
	],
});
