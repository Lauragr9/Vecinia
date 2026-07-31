import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Vecinia</CardTitle>
          <CardDescription>Accede a tu comunidad de propietarios</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 space-y-1 text-xs text-muted-foreground">
            <p className="font-medium">Usuarios de prueba (contraseña: password123)</p>
            <p>admin@fincas.test — Administrador de fincas</p>
            <p>presidente@fincas.test — Presidente</p>
            <p>vecino1@fincas.test — Vecino</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
