import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { createMovimientoAction } from "@/lib/actions/gastos";

export default async function NuevoMovimientoPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const basePath = `/admin/comunidades/${comunidadId}/gastos`;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo movimiento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMovimientoAction.bind(null, comunidadId, basePath)} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <NativeSelect id="tipo" name="tipo" defaultValue="INGRESO">
                <option value="INGRESO">Ingreso</option>
                <option value="GASTO">Gasto</option>
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="concepto">Concepto</Label>
              <Input id="concepto" name="concepto" required placeholder="Cuotas mensuales" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="importe">Importe (€)</Label>
              <Input id="importe" name="importe" type="number" step="0.01" min="0" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
