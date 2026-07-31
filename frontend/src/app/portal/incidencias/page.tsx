import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortalMembership } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { IncidenciasList } from "@/components/incidencias/incidencias-list";

export default async function IncidenciasPortalPage() {
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.incidencias.label}
        icon={MODULES.incidencias.icon}
        color={MODULES.incidencias.color}
        action={
          <Button nativeButton={false} render={<Link href="/portal/incidencias/nueva" />}>
            <Plus className="size-4" /> Nueva incidencia
          </Button>
        }
      />
      <IncidenciasList comunidadId={membership.comunidadId} basePath="/portal/incidencias" />
    </div>
  );
}
