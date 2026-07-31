import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { createZonaAction } from "@/lib/actions/reservas";

export default async function NuevaZonaPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const basePath = `/admin/comunidades/${comunidadId}/reservas`;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nueva zona común</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createZonaAction.bind(null, comunidadId, basePath)} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required placeholder="Piscina" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Input id="descripcion" name="descripcion" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear zona</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
