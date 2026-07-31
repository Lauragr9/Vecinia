import { IncidenciaDetail } from "@/components/incidencias/incidencia-detail";

export default async function IncidenciaAdminDetailPage({
  params,
}: {
  params: Promise<{ comunidadId: string; incidenciaId: string }>;
}) {
  const { comunidadId, incidenciaId } = await params;

  return (
    <IncidenciaDetail
      comunidadId={comunidadId}
      incidenciaId={incidenciaId}
      basePath={`/admin/comunidades/${comunidadId}/incidencias`}
      canManage
    />
  );
}
