import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession, getPortalMembership } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { ReservasBoard } from "@/components/reservas/reservas-board";

export default async function ReservasPortalPage() {
  const session = await getSession();
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.reservas.label}
        icon={MODULES.reservas.icon}
        color={MODULES.reservas.color}
        action={
          <Button nativeButton={false} render={<Link href="/portal/reservas/nueva" />}>
            <Plus className="size-4" /> Nueva reserva
          </Button>
        }
      />
      <ReservasBoard
        comunidadId={membership.comunidadId}
        basePath="/portal/reservas"
        userId={session.user.id}
        canManageAll={membership.role === "ADMIN" || membership.role === "PRESIDENTE"}
      />
    </div>
  );
}
