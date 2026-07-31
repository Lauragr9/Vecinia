import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { eliminarUnidadAction } from "./actions";

const TIPO_LABELS: Record<string, string> = {
  VIVIENDA: "Vivienda",
  GARAJE: "Garaje",
  TRASTERO: "Trastero",
};

export default async function EdificiosPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  const edificios = await prisma.edificio.findMany({
    where: { comunidadId },
    include: {
      unidades: {
        include: { propietario: true, inquilino: true },
        orderBy: { identificador: "asc" },
      },
    },
    orderBy: { nombre: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edificios y unidades</h1>
        <Button nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/edificios/nuevo`} />}>
          + Nuevo edificio
        </Button>
      </div>

      {edificios.length === 0 && (
        <p className="text-muted-foreground">Todavía no hay edificios en esta comunidad.</p>
      )}

      {edificios.map((edificio) => (
        <Card key={edificio.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{edificio.nombre}</CardTitle>
              <p className="text-sm text-muted-foreground">{edificio.direccion}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/edificios/${edificio.id}/unidades/nueva`} />}
            >
              + Unidad
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Propietario</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {edificio.unidades.map((unidad) => (
                  <TableRow key={unidad.id}>
                    <TableCell>{unidad.identificador}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{TIPO_LABELS[unidad.tipo]}</Badge>
                    </TableCell>
                    <TableCell>{unidad.propietario?.nombre ?? "-"}</TableCell>
                    <TableCell>{unidad.inquilino?.nombre ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <form action={eliminarUnidadAction.bind(null, comunidadId, unidad.id)}>
                        <Button type="submit" variant="ghost" size="sm">
                          Eliminar
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
                {edificio.unidades.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Sin unidades todavía.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
