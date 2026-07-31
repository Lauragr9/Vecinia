import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resuelto",
};

const ESTADO_VARIANTS: Record<string, "secondary" | "default" | "destructive"> = {
  PENDIENTE: "destructive",
  EN_PROCESO: "default",
  RESUELTO: "secondary",
};

export async function IncidenciasList({
  comunidadId,
  basePath,
}: {
  comunidadId: string;
  basePath: string;
}) {
  const incidencias = await prisma.incidencia.findMany({
    where: { comunidadId },
    include: { unidad: true, creadoPor: true },
    orderBy: { createdAt: "desc" },
  });

  if (incidencias.length === 0) {
    return <p className="text-muted-foreground">No hay incidencias todavía.</p>;
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
