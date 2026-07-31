import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { VotacionesList } from "@/components/votaciones/votaciones-list";

export default async function VotacionesAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  const basePath = `/admin/comunidades/${comunidadId}/votaciones`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.votaciones.label}
        icon={MODULES.votaciones.icon}
        color={MODULES.votaciones.color}
        action={
          <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>
            <Plus className="size-4" /> Nueva votación
          </Button>
        }
      />
      <VotacionesList comunidadId={comunidadId} basePath={basePath} misUnidades={[]} />
    </div>
  );
}
