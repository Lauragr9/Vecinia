import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
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
      <PageHeader
        title={MODULES.incidencias.label}
        icon={MODULES.incidencias.icon}
        color={MODULES.incidencias.color}
        action={
          <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>
            <Plus className="size-4" /> Nueva incidencia
          </Button>
        }
      />
      <IncidenciasList comunidadId={comunidadId} basePath={basePath} />
    </div>
  );
}
