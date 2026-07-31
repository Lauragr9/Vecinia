import { apiGet } from "@/lib/api-client";
import type { ZonaComunConReservas } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { MODULES } from "@/lib/modules";
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
  const zonas = await apiGet<ZonaComunConReservas[]>(`/api/comunidades/${comunidadId}/reservas`);

  if (zonas.length === 0) {
    return <EmptyState icon={MODULES.reservas.icon} message="Todavía no hay zonas comunes configuradas." />;
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
                    {new Date(reserva.fecha).toLocaleDateString("es-ES")} · {reserva.horaInicio}–{reserva.horaFin} ·{" "}
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
