import nodemailer from 'nodemailer';

// Simple, reusable mailer using Gmail (or any SMTP) via env vars.
// Expects: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
let cachedTransporter;

function buildTransporter() {
	if (cachedTransporter) return cachedTransporter;

	const {
		SMTP_HOST,
		SMTP_PORT = 587,
		SMTP_USER,
		SMTP_PASS,
	} = process.env;

	// Prefer explicit SMTP config; fallback to Gmail service shortcut if host is missing.
	const hasHostConfig = SMTP_HOST && SMTP_USER && SMTP_PASS;
	cachedTransporter = nodemailer.createTransport(
		hasHostConfig
			? {
					host: SMTP_HOST,
					port: Number(SMTP_PORT) || 587,
					secure: Number(SMTP_PORT) === 465,
					auth: { user: SMTP_USER, pass: SMTP_PASS },
				}
			: {
					service: 'gmail',
					auth: { user: SMTP_USER, pass: SMTP_PASS },
				}
	);

	return cachedTransporter;
}

export async function sendEmail({ to, subject, html, text }) {
	if (!to || !subject || !(html || text)) {
		throw new Error('to, subject, and html/text are required to send an email');
	}

	const from = process.env.SMTP_FROM || 'veeranvinothsankar@gmail.com';
	const transporter = buildTransporter();

	return transporter.sendMail({ from, to, subject, html, text });
}

export default { sendEmail };
