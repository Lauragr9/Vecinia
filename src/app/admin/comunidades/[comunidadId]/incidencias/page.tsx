import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IncidenciasList } from "@/components/incidencias/incidencias-list";

export default async function IncidenciasAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  const basePath = `/admin/comunidades/${comunidadId}/incidencias`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Incidencias</h1>
        <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>+ Nueva incidencia</Button>
      </div>
      <IncidenciasList comunidadId={comunidadId} basePath={basePath} />
    </div>
  );
}
