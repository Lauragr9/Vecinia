import { NuevaIncidenciaForm } from "@/components/incidencias/nueva-incidencia-form";

export default async function NuevaIncidenciaAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;

  return (
    <NuevaIncidenciaForm
      comunidadId={comunidadId}
      unidadId={null}
      basePath={`/admin/comunidades/${comunidadId}/incidencias`}
      error={error}
    />
  );
}
