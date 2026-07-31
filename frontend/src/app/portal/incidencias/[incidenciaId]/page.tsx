import { getPortalMembership } from "@/lib/dal";
import { IncidenciaDetail } from "@/components/incidencias/incidencia-detail";

export default async function IncidenciaPortalDetailPage({
  params,
}: {
  params: Promise<{ incidenciaId: string }>;
}) {
  const { incidenciaId } = await params;
  const membership = await getPortalMembership();

  return (
    <IncidenciaDetail
      comunidadId={membership.comunidadId}
      incidenciaId={incidenciaId}
      basePath="/portal/incidencias"
      canManage={membership.role === "ADMIN" || membership.role === "PRESIDENTE"}
    />
  );
}
