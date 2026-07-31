import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { VotacionesList } from "@/components/votaciones/votaciones-list";

export default async function VotacionesPortalPage() {
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Votaciones</h1>
        {(membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
          <Button nativeButton={false} render={<Link href="/portal/votaciones/nueva" />}>+ Nueva votación</Button>
        )}
      </div>
      <VotacionesList comunidadId={membership.comunidadId} basePath="/portal/votaciones" misUnidades={unidades} />
    </div>
  );
}
