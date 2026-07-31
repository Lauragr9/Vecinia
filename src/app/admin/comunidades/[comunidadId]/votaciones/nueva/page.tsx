import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { createVotacionAction } from "@/lib/actions/votaciones";

export default async function NuevaVotacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const basePath = `/admin/comunidades/${comunidadId}/votaciones`;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nueva votación</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createVotacionAction.bind(null, comunidadId, basePath)} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="pregunta">Pregunta</Label>
              <Input id="pregunta" name="pregunta" required placeholder="¿Aprobar presupuesto para pintar fachada?" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaCierre">Fecha de cierre</Label>
              <Input id="fechaCierre" name="fechaCierre" type="date" required />
            </div>
            <div className="flex items-center gap-2">
              <input id="resultadosVisibles" name="resultadosVisibles" type="checkbox" defaultChecked className="h-4 w-4" />
              <Label htmlFor="resultadosVisibles" className="font-normal">
                Mostrar resultados en tiempo real a los vecinos
              </Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear votación</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
