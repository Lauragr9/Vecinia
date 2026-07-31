import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { NuevaIncidenciaForm } from "@/components/incidencias/nueva-incidencia-form";

export default async function NuevaIncidenciaPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);

  return (
    <NuevaIncidenciaForm
      comunidadId={membership.comunidadId}
      unidadId={unidades[0]?.id ?? null}
      basePath="/portal/incidencias"
      error={error}
    />
  );
}
