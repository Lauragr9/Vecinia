import { prisma } from "@/lib/prisma";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";

export default async function NuevaReservaPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const membership = await getPortalMembership();

  const [zonas, unidades] = await Promise.all([
    prisma.zonaComun.findMany({ where: { comunidadId: membership.comunidadId }, orderBy: { nombre: "asc" } }),
    getMisUnidades(membership.comunidadId),
  ]);

  return (
    <NuevaReservaForm
      comunidadId={membership.comunidadId}
      basePath="/portal/reservas"
      zonas={zonas}
      unidades={unidades}
      error={error}
    />
  );
}
