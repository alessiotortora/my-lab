/**
 * Hono context variables for session management
 */
export type Variables = {
	user: { id: string; email?: string } | null;
	session: { id: string; expiresAt: Date } | null;
};
