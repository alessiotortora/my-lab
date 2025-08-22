import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface VerificationEmailProps {
	verificationUrl: string;
	userName?: string;
}

export const VerificationEmail = ({
	verificationUrl,
	userName,
}: VerificationEmailProps) => (
	<Html>
		<Head />
		<Preview>Verify your email to complete your registration</Preview>
		<Body style={main}>
			<Container style={container}>
				<Section style={logoContainer}>
					<Heading style={logo}>Your App</Heading>
				</Section>

				<Heading style={h1}>Verify Your Email Address</Heading>

				<Text style={text}>Hello{userName ? ` ${userName}` : ""},</Text>

				<Text style={text}>
					Thank you for signing up! To complete your registration and start
					using your account, please verify your email address by clicking the
					button below:
				</Text>

				<Section style={buttonContainer}>
					<Button style={button} href={verificationUrl}>
						Verify Email Address
					</Button>
				</Section>

				<Text style={text}>
					If the button doesn't work, you can copy and paste this link into your
					browser:
				</Text>

				<Section style={codeContainer}>
					<Link href={verificationUrl} style={link}>
						{verificationUrl}
					</Link>
				</Section>

				<Text style={text}>
					This verification link will expire in 24 hours for security purposes.
				</Text>

				<Text style={text}>
					If you didn't create an account with us, you can safely ignore this
					email.
				</Text>

				<Section style={footer}>
					<Text style={footerText}>
						Best regards,
						<br />
						Your App Team
					</Text>
				</Section>
			</Container>
		</Body>
	</Html>
);

// Styles
const main = {
	backgroundColor: "#f8fafc",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
	backgroundColor: "#ffffff",
	margin: "0 auto",
	padding: "20px 0 48px",
	marginBottom: "64px",
	borderRadius: "8px",
	boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
};

const logoContainer = {
	padding: "32px",
	textAlign: "center" as const,
	borderBottom: "1px solid #f1f5f9",
};

const logo = {
	color: "#2563eb",
	fontSize: "24px",
	fontWeight: "bold",
	margin: "0",
};

const h1 = {
	color: "#1f2937",
	fontSize: "24px",
	fontWeight: "bold",
	textAlign: "center" as const,
	margin: "30px 0",
	padding: "0 32px",
};

const text = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "1.6",
	margin: "16px 0",
	padding: "0 32px",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const button = {
	backgroundColor: "#2563eb",
	borderRadius: "6px",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
	lineHeight: "1.25",
};

const codeContainer = {
	background: "#f8fafc",
	borderRadius: "4px",
	margin: "16px 32px",
	padding: "16px",
};

const link = {
	color: "#2563eb",
	fontSize: "14px",
	textDecoration: "none",
	wordBreak: "break-all" as const,
};

const footer = {
	borderTop: "1px solid #f1f5f9",
	margin: "32px 0 0 0",
	padding: "32px",
	textAlign: "center" as const,
};

const footerText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "1.6",
	margin: "0",
};

export default VerificationEmail;
