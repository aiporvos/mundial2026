import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "noreply@tusitiofigus.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verificar-email?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verificá tu cuenta — Figus",
    html: `
      <h2>Bienvenido a Figus</h2>
      <p>Hacé clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Verificar cuenta</a>
      <p>El enlace expira en 24 horas.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/resetear-password?token=${token}`;
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Restablecer contraseña — Figus",
    html: `
      <h2>Restablecer contraseña</h2>
      <p>Hacé clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Restablecer contraseña</a>
      <p>El enlace expira en 1 hora. Si no solicitaste esto, ignorá este email.</p>
    `,
  });
}
