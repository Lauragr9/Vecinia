import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPortalMembership } from "@/lib/dal";
import { IncidenciasList } from "@/components/incidencias/incidencias-list";

export default async function IncidenciasPortalPage() {
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Incidencias</h1>
        <Button nativeButton={false} render={<Link href="/portal/incidencias/nueva" />}>+ Nueva incidencia</Button>
      </div>
      <IncidenciasList comunidadId={membership.comunidadId} basePath="/portal/incidencias" />
    </div>
  );
}
