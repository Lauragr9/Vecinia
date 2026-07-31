import { apiGet } from "@/lib/api-client";
import type { ZonaComun } from "@/types/api";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";

export default async function NuevaReservaPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const membership = await getPortalMembership();

  const [zonas, unidades] = await Promise.all([
    apiGet<ZonaComun[]>(`/api/comunidades/${membership.comunidadId}/zonas`),
    getMisUnidades(membership.comunidadId),
  ]);

  return (
    <NuevaReservaForm
      comunidadId={membership.comunidadId}
      basePath="/portal/reservas"
      zonas={zonas}
      unidades={unidades}
      error={error}
    />
  );
}
