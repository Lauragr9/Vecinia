import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "Vecinia <onboarding@resend.dev>";
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

function wrapper(title: string, bodyHtml: string, ctaLabel: string, ctaUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #ea580c; font-size: 20px;">Vecinia</h1>
      <h2 style="font-size: 18px;">${title}</h2>
      <p style="color: #444; line-height: 1.5;">${bodyHtml}</p>
      <a href="${ctaUrl}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #ea580c; color: #fff7ed; text-decoration: none; border-radius: 8px; font-weight: 600;">
        ${ctaLabel}
      </a>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        Si no esperabas este correo, puedes ignorarlo.
      </p>
    </div>
  `;
}

// El envío nunca debe tumbar el registro/invitación: si Resend rechaza el
// correo (p. ej. cuenta de prueba sin dominio verificado, solo puede enviar
// a la propia dirección del titular de la API key), lo dejamos registrado
// en el log del servidor junto con el enlace, para poder probarlo a mano.
async function safeSend(args: { to: string; subject: string; html: string; debugUrl: string }) {
  try {
    const result = await resend.emails.send({ from: FROM, to: args.to, subject: args.subject, html: args.html });
    if (result.error) {
      console.warn(`[email] Resend rechazó el envío a ${args.to}: ${result.error.message}`);
      console.warn(`[email] Enlace (para probar a mano): ${args.debugUrl}`);
    }
  } catch (err) {
    console.warn(`[email] No se ha podido enviar a ${args.to}:`, err);
    console.warn(`[email] Enlace (para probar a mano): ${args.debugUrl}`);
  }
}

export async function sendVerificationEmail(to: string, nombre: string, token: string) {
  const url = `${FRONTEND_URL}/verificar-email?token=${token}`;
  await safeSend({
    to,
    subject: "Confirma tu cuenta en Vecinia",
    debugUrl: url,
    html: wrapper(
      `Hola ${nombre},`,
      "Gracias por registrarte en Vecinia. Confirma tu email para activar tu cuenta y empezar a gestionar tus comunidades.",
      "Confirmar mi cuenta",
      url
    ),
  });
}

export async function sendInviteEmail(to: string, comunidadNombre: string, token: string) {
  const url = `${FRONTEND_URL}/completar-registro?token=${token}`;
  await safeSend({
    to,
    subject: `Te han invitado a Vecinia (${comunidadNombre})`,
    debugUrl: url,
    html: wrapper(
      "Te han dado de alta en Vecinia",
      `El administrador de <strong>${comunidadNombre}</strong> te ha añadido como vecino. Completa tu registro para acceder a incidencias, reservas, votaciones y más.`,
      "Completar mi registro",
      url
    ),
  });
}
