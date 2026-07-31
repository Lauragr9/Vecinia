import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/dal";
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reservas</h1>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href={`${basePath}/zonas/nueva`} />}>
            + Zona común
          </Button>
          <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>+ Nueva reserva</Button>
        </div>
      </div>
      <ReservasBoard comunidadId={comunidadId} basePath={basePath} userId={session.user.id} canManageAll />
    </div>
  );
}
