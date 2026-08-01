import Link from "next/link";
import { CircleAlert } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export default async function VerificarEmailErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <AuthShell title="No se ha podido verificar" description="">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <CircleAlert className="size-6" />
        </span>
        <p className="text-sm text-muted-foreground">{message ?? "El enlace no es válido o ha caducado."}</p>
        <Button nativeButton={false} render={<Link href="/registro" />}>
          Volver a intentarlo
        </Button>
      </div>
    </AuthShell>
  );
}
