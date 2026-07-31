import { apiGet } from "@/lib/api-client";
import type { Edificio, ZonaComun } from "@/types/api";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";

export default async function NuevaReservaAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;

  const [zonas, edificios] = await Promise.all([
    apiGet<ZonaComun[]>(`/api/comunidades/${comunidadId}/zonas`),
    apiGet<Edificio[]>(`/api/comunidades/${comunidadId}/edificios`),
  ]);
  const unidades = edificios.flatMap((e) => e.unidades);

  return (
    <NuevaReservaForm
      comunidadId={comunidadId}
      basePath={`/admin/comunidades/${comunidadId}/reservas`}
      zonas={zonas}
      unidades={unidades}
      error={error}
    />
  );
}
