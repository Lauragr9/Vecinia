import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { votarAction } from "@/lib/actions/votaciones";

const OPCION_LABELS: Record<string, string> = { SI: "Sí", NO: "No", ABSTENCION: "Abstención" };

export async function VotacionesList({
  comunidadId,
  basePath,
  misUnidades,
}: {
  comunidadId: string;
  basePath: string;
  misUnidades: { id: string; identificador: string }[];
}) {
  const votaciones = await prisma.votacion.findMany({
    where: { comunidadId },
    include: { votos: true },
    orderBy: { fechaCierre: "desc" },
  });

  if (votaciones.length === 0) {
    return <p className="text-muted-foreground">No hay votaciones todavía.</p>;
  }

  const now = new Date();

  return (
    <div className="flex flex-col gap-4">
      {votaciones.map((votacion) => {
        const abierta = votacion.fechaCierre > now;
        const totales = { SI: 0, NO: 0, ABSTENCION: 0 };
        for (const voto of votacion.votos) totales[voto.opcion]++;
        const totalVotos = votacion.votos.length;
        const mostrarResultados = votacion.resultadosVisibles || !abierta;

        const miUnidad = misUnidades[0];
        const miVoto = miUnidad ? votacion.votos.find((v) => v.unidadId === miUnidad.id) : undefined;

        return (
          <Card key={votacion.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base">{votacion.pregunta}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Cierre: {votacion.fechaCierre.toLocaleDateString("es-ES")} · {totalVotos} votos emitidos
                </p>
              </div>
              <Badge variant={abierta ? "default" : "secondary"}>{abierta ? "Abierta" : "Cerrada"}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {mostrarResultados && (
                <div className="flex gap-4 text-sm">
                  <span>Sí: {totales.SI}</span>
                  <span>No: {totales.NO}</span>
                  <span>Abstención: {totales.ABSTENCION}</span>
                </div>
              )}

              {abierta && miUnidad && (
                <form
                  action={votarAction.bind(null, comunidadId, votacion.id, miUnidad.id, basePath)}
                  className="flex items-center gap-2"
                >
                  <span className="text-sm text-muted-foreground">
                    {miVoto ? `Tu voto (${miUnidad.identificador}): ${OPCION_LABELS[miVoto.opcion]}. Cambiar:` : `Vota como ${miUnidad.identificador}:`}
                  </span>
                  <Button type="submit" name="opcion" value="SI" size="sm" variant="outline">
                    Sí
                  </Button>
                  <Button type="submit" name="opcion" value="NO" size="sm" variant="outline">
                    No
                  </Button>
                  <Button type="submit" name="opcion" value="ABSTENCION" size="sm" variant="outline">
                    Abstención
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
