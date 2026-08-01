import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthShell title="Vecinia" description="Accede a tu comunidad de propietarios">
      <LoginForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        ¿Eres administrador de fincas y no tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-primary hover:underline">
          Crear cuenta
        </Link>
      </p>
      <div className="mt-6 space-y-1 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Usuarios de prueba (contraseña: password123)</p>
        <p>admin@fincas.test — Administrador de fincas</p>
        <p>presidente@fincas.test — Presidente</p>
        <p>vecino1@fincas.test — Vecino</p>
      </div>
    </AuthShell>
  );
}
