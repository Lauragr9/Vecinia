import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession, getPortalMembership } from "@/lib/dal";
import { ReservasBoard } from "@/components/reservas/reservas-board";

export default async function ReservasPortalPage() {
  const session = await getSession();
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <Button nativeButton={false} render={<Link href="/portal/reservas/nueva" />}>+ Nueva reserva</Button>
      </div>
      <ReservasBoard
        comunidadId={membership.comunidadId}
        basePath="/portal/reservas"
        userId={session.user.id}
        canManageAll={membership.role === "ADMIN" || membership.role === "PRESIDENTE"}
      />
    </div>
  );
}
