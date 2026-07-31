import Link from "next/link";
import { Plus } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import type { Edificio } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MODULES } from "@/lib/modules";
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

  const edificios = await apiGet<Edificio[]>(`/api/comunidades/${comunidadId}/edificios`);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.edificios.label}
        icon={MODULES.edificios.icon}
        color={MODULES.edificios.color}
        action={
          <Button nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/edificios/nuevo`} />}>
            <Plus className="size-4" /> Nuevo edificio
          </Button>
        }
      />

      {edificios.length === 0 && (
        <EmptyState icon={MODULES.edificios.icon} message="Todavía no hay edificios en esta comunidad." />
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
