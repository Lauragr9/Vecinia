import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { createIncidenciaAction } from "@/lib/actions/incidencias";

export function NuevaIncidenciaForm({
  comunidadId,
  unidadId,
  basePath,
  error,
}: {
  comunidadId: string;
  unidadId: string | null;
  basePath: string;
  error?: string;
}) {
  const action = createIncidenciaAction.bind(null, comunidadId, unidadId, basePath);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nueva incidencia</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required placeholder="Ascensor averiado" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" required placeholder="No funciona desde esta mañana." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fotos">Fotos (opcional)</Label>
              <Input id="fotos" name="fotos" type="file" accept="image/*" multiple />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear incidencia</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
