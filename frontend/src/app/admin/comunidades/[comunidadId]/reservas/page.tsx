import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { ReservasBoard } from "@/components/reservas/reservas-board";

export default async function ReservasAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  const session = await getSession();
  const basePath = `/admin/comunidades/${comunidadId}/reservas`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.reservas.label}
        icon={MODULES.reservas.icon}
        color={MODULES.reservas.color}
        action={
          <div className="flex gap-2">
            <Button variant="outline" nativeButton={false} render={<Link href={`${basePath}/zonas/nueva`} />}>
              <Plus className="size-4" /> Zona común
            </Button>
            <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>
              <Plus className="size-4" /> Nueva reserva
            </Button>
          </div>
        }
      />
      <ReservasBoard comunidadId={comunidadId} basePath={basePath} userId={session.user.id} canManageAll />
    </div>
  );
}
