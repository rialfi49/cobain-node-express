// utils/email.js
import nodemailer from "nodemailer";

let transporter = null;

export async function createTransporter() {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_SECURE } =
    process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error("SMTP config missing in environment variables");
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // transporter = nodemailer.createTransport({
  //   host: EMAIL_HOST,
  //   port: Number(EMAIL_PORT),
  //   secure: EMAIL_SECURE === "true" || EMAIL_SECURE === true,
  //   auth: {
  //     user: EMAIL_USER,
  //     pass: EMAIL_PASS,
  //   },
  // });

  // Verifikasi koneksi sekarang, agar kesalahan diketahui saat start
  await transporter.verify();
  return transporter;
}

/**
 * sendEmail({ to, subject, html, text })
 */
export async function sendEmail({ to, subject, html, text }) {
  const tr = await createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const info = await tr.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}
