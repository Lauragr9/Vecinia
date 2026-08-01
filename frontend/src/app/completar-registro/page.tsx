import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { AcceptInviteForm } from "./accept-invite-form";

export default async function CompletarRegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell title="Enlace no válido" description="">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <CircleAlert className="size-6" />
          </span>
          <p className="text-sm text-muted-foreground">Falta el enlace de invitación.</p>
          <Button nativeButton={false} render={<Link href="/login" />}>
            Ir al inicio de sesión
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Completa tu registro" description="Te han invitado a Vecinia">
      <AcceptInviteForm token={token} />
    </AuthShell>
  );
}
