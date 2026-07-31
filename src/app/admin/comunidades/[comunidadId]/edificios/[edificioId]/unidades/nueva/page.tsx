import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { createUnidadAction } from "../../../actions";

export default async function NuevaUnidadPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string; edificioId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId, edificioId } = await params;
  const { error } = await searchParams;
  const backHref = `/admin/comunidades/${comunidadId}/edificios`;

  const memberships = await prisma.membership.findMany({
    where: { comunidadId, role: { in: ["VECINO", "PRESIDENTE"] } },
    include: { user: true },
    orderBy: { user: { nombre: "asc" } },
  });

  const action = createUnidadAction.bind(null, comunidadId, edificioId);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nueva unidad</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo</Label>
              <NativeSelect id="tipo" name="tipo" defaultValue="VIVIENDA">
                <option value="VIVIENDA">Vivienda</option>
                <option value="GARAJE">Plaza de garaje</option>
                <option value="TRASTERO">Trastero</option>
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="identificador">Identificador</Label>
              <Input id="identificador" name="identificador" required placeholder="1ºA" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="propietarioId">Propietario</Label>
              <NativeSelect id="propietarioId" name="propietarioId" defaultValue="">
                <option value="">Sin asignar</option>
                {memberships.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.user.nombre} ({m.user.email})
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="inquilinoId">Inquilino (si aplica)</Label>
              <NativeSelect id="inquilinoId" name="inquilinoId" defaultValue="">
                <option value="">Sin inquilino</option>
                {memberships.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.user.nombre} ({m.user.email})
                  </option>
                ))}
              </NativeSelect>
            </div>
            {memberships.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Todavía no hay vecinos dados de alta en esta comunidad. Puedes crear la unidad sin asignar y
                asociarla más adelante.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={backHref} />}>
                Cancelar
              </Button>
              <Button type="submit">Crear unidad</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
