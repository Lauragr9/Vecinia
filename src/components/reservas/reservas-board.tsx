import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cancelarReservaAction } from "@/lib/actions/reservas";

export async function ReservasBoard({
  comunidadId,
  basePath,
  userId,
  canManageAll,
}: {
  comunidadId: string;
  basePath: string;
  userId: string;
  canManageAll: boolean;
}) {
  const zonas = await prisma.zonaComun.findMany({
    where: { comunidadId },
    include: {
      reservas: {
        where: { estado: "CONFIRMADA", fecha: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        include: { unidad: true },
        orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
      },
    },
    orderBy: { nombre: "asc" },
  });

  if (zonas.length === 0) {
    return <p className="text-muted-foreground">Todavía no hay zonas comunes configuradas.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {zonas.map((zona) => (
        <Card key={zona.id}>
          <CardHeader>
            <CardTitle className="text-base">{zona.nombre}</CardTitle>
            {zona.descripcion && <p className="text-sm text-muted-foreground">{zona.descripcion}</p>}
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {zona.reservas.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin reservas próximas.</p>
            )}
            {zona.reservas.map((reserva) => {
              const canCancel =
                canManageAll || reserva.unidad.propietarioId === userId || reserva.unidad.inquilinoId === userId;
              return (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>
                    {reserva.fecha.toLocaleDateString("es-ES")} · {reserva.horaInicio}–{reserva.horaFin} ·{" "}
                    {reserva.unidad.identificador}
                  </span>
                  {canCancel && (
                    <form action={cancelarReservaAction.bind(null, comunidadId, reserva.id, basePath)}>
                      <Button type="submit" variant="ghost" size="sm">
                        Cancelar
                      </Button>
                    </form>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
