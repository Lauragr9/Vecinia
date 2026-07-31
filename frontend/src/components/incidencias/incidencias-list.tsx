import Link from "next/link";
import { apiGet } from "@/lib/api-client";
import type { Incidencia } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { MODULES } from "@/lib/modules";

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resuelto",
};

const ESTADO_VARIANTS: Record<string, "warning" | "default" | "success"> = {
  PENDIENTE: "warning",
  EN_PROCESO: "default",
  RESUELTO: "success",
};

export async function IncidenciasList({
  comunidadId,
  basePath,
}: {
  comunidadId: string;
  basePath: string;
}) {
  const incidencias = await apiGet<Incidencia[]>(`/api/comunidades/${comunidadId}/incidencias`);

  if (incidencias.length === 0) {
    return <EmptyState icon={MODULES.incidencias.icon} message="No hay incidencias todavía." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {incidencias.map((incidencia) => (
        <Link key={incidencia.id} href={`${basePath}/${incidencia.id}`}>
          <Card className="transition-colors hover:border-primary">
            <CardContent className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">{incidencia.titulo}</p>
                <p className="text-sm text-muted-foreground">
                  {incidencia.unidad ? `${incidencia.unidad.identificador} · ` : ""}
                  Creada por {incidencia.creadoPor.nombre}
                </p>
              </div>
              <Badge variant={ESTADO_VARIANTS[incidencia.estado]}>{ESTADO_LABELS[incidencia.estado]}</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
