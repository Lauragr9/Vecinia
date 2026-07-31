import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { VotacionesList } from "@/components/votaciones/votaciones-list";

export default async function VotacionesPortalPage() {
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.votaciones.label}
        icon={MODULES.votaciones.icon}
        color={MODULES.votaciones.color}
        action={
          (membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
            <Button nativeButton={false} render={<Link href="/portal/votaciones/nueva" />}>
              <Plus className="size-4" /> Nueva votación
            </Button>
          )
        }
      />
      <VotacionesList comunidadId={membership.comunidadId} basePath="/portal/votaciones" misUnidades={unidades} />
    </div>
  );
}
