import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { createReservaAction } from "@/lib/actions/reservas";

export function NuevaReservaForm({
  comunidadId,
  basePath,
  zonas,
  unidades,
  error,
}: {
  comunidadId: string;
  basePath: string;
  zonas: { id: string; nombre: string }[];
  unidades: { id: string; identificador: string }[];
  error?: string;
}) {
  const action = createReservaAction.bind(null, comunidadId, basePath);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nueva reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="zonaComunId">Zona común</Label>
              <NativeSelect id="zonaComunId" name="zonaComunId" required>
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre}
                  </option>
                ))}
              </NativeSelect>
            </div>
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
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" name="fecha" type="date" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="horaInicio">Hora inicio</Label>
                <Input id="horaInicio" name="horaInicio" type="time" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="horaFin">Hora fin</Label>
                <Input id="horaFin" name="horaFin" type="time" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Reservar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
