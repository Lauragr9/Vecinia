import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { resendVerificationAction } from "../actions";

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; reenviado?: string }>;
}) {
  const { email, reenviado } = await searchParams;

  return (
    <AuthShell title="Revisa tu email" description="Casi lo tienes">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-status-good/10 text-status-good">
          <MailCheck className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">
          Te hemos enviado un enlace de confirmación a <strong className="text-foreground">{email}</strong>. Ábrelo
          para activar tu cuenta.
        </p>
        {reenviado && <p className="text-sm text-status-good">Te hemos enviado un nuevo enlace.</p>}
        {email && (
          <form action={resendVerificationAction.bind(null, email)}>
            <Button type="submit" variant="outline" size="sm">
              Reenviar email
            </Button>
          </form>
        )}
      </div>
    </AuthShell>
  );
}
