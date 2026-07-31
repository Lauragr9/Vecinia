import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { getSession } from "@/lib/dal";
import { AppHeader } from "@/components/app-header";
import { createComunidadAction } from "./actions";

export default async function NuevaComunidadPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const session = await getSession();

  return (
    <>
      <AppHeader
        title="Panel de administrador"
        userName={session.user.name ?? session.user.email ?? ""}
        homeHref="/admin"
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg">
          <Card>
            <CardHeader>
              <CardTitle>Nueva comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createComunidadAction} className="flex flex-col gap-4">
                <FormError message={error} />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" required placeholder="Residencial Los Almendros" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" name="direccion" required placeholder="Calle Mayor 12, Madrid" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cif">CIF (opcional)</Label>
                  <Input id="cif" name="cif" placeholder="H12345678" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" nativeButton={false} render={<Link href="/admin" />}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear comunidad</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
