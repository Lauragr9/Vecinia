import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { createVecinoAction } from "../actions";

export default async function NuevoVecinoPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const action = createVecinoAction.bind(null, comunidadId);
  const backHref = `/admin/comunidades/${comunidadId}/vecinos`;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo vecino</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="vecino@email.com" />
              <p className="text-xs text-muted-foreground">
                Le enviaremos una invitación a este email para que complete su registro (nombre, teléfono y
                contraseña).
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Rol</Label>
              <NativeSelect id="role" name="role" defaultValue="VECINO">
                <option value="VECINO">Vecino</option>
                <option value="PRESIDENTE">Presidente</option>
              </NativeSelect>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={backHref} />}>
                Cancelar
              </Button>
              <Button type="submit">Enviar invitación</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
