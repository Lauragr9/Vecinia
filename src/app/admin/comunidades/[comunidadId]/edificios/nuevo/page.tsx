import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { createEdificioAction } from "../actions";

export default async function NuevoEdificioPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const backHref = `/admin/comunidades/${comunidadId}/edificios`;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo edificio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEdificioAction.bind(null, comunidadId)} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required placeholder="Bloque A" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={backHref} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear edificio</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
