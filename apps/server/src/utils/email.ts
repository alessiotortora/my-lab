import { render } from "@react-email/render";
import { Resend } from "resend";
import { PasswordResetEmail, VerificationEmail } from "../emails";

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates are now handled by React Email components

/**
 * Send verification email to user using React Email template
 */
export async function sendVerificationEmail(
	email: string,
	verificationUrl: string,
	userName?: string,
) {
	try {
		const emailHtml = await render(
			VerificationEmail({ verificationUrl, userName }),
		);

		const result = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
			to: email,
			subject: "Verify your email address",
			html: emailHtml,
		});

		console.log("Verification email sent successfully:", result.data?.id);
		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Failed to send verification email:", error);
		throw new Error("Failed to send verification email");
	}
}

/**
 * Send password reset email to user using React Email template
 */
export async function sendPasswordResetEmail(
	email: string,
	resetUrl: string,
	userName?: string,
) {
	try {
		const emailHtml = await render(PasswordResetEmail({ resetUrl, userName }));

		const result = await resend.emails.send({
			from: process.env.RESEND_FROM_EMAIL || "noreply@yourdomain.com",
			to: email,
			subject: "Reset your password",
			html: emailHtml,
		});

		console.log("Password reset email sent successfully:", result.data?.id);
		return { success: true, messageId: result.data?.id };
	} catch (error) {
		console.error("Failed to send password reset email:", error);
		throw new Error("Failed to send password reset email");
	}
}

// HTML templates have been replaced with React Email components
// See src/emails/ directory for the new template implementations
