import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import type { Edificio } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { createReciboAction } from "@/lib/actions/gastos";

export default async function NuevoReciboPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;
  const basePath = `/admin/comunidades/${comunidadId}/gastos/recibos`;

  const edificios = await apiGet<Edificio[]>(`/api/comunidades/${comunidadId}/edificios`);
  const unidades = edificios.flatMap((e) => e.unidades);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo recibo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createReciboAction.bind(null, comunidadId, basePath)} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="unidadId">Unidad</Label>
              <NativeSelect id="unidadId" name="unidadId" required>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.identificador}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="concepto">Concepto</Label>
              <Input id="concepto" name="concepto" required placeholder="Cuota comunidad" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="importe">Importe (€)</Label>
              <Input id="importe" name="importe" type="number" step="0.01" min="0" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaEmision">Emisión</Label>
                <Input id="fechaEmision" name="fechaEmision" type="date" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="fechaVencimiento">Vencimiento</Label>
                <Input id="fechaVencimiento" name="fechaVencimiento" type="date" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear recibo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
