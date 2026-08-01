import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "./register-form";

export default function RegistroPage() {
  return (
    <AuthShell title="Crea tu cuenta" description="Regístrate como administrador de fincas">
      <RegisterForm />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
