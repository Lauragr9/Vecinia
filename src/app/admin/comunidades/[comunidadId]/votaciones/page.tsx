import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Votaciones</h1>
        <Button nativeButton={false} render={<Link href={`${basePath}/nueva`} />}>+ Nueva votación</Button>
      </div>
      <VotacionesList comunidadId={comunidadId} basePath={basePath} misUnidades={[]} />
    </div>
  );
}
