import { prisma } from "@/lib/prisma";
import { NuevaReservaForm } from "@/components/reservas/nueva-reserva-form";

export default async function NuevaReservaAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { comunidadId } = await params;
  const { error } = await searchParams;

  const [zonas, unidades] = await Promise.all([
    prisma.zonaComun.findMany({ where: { comunidadId }, orderBy: { nombre: "asc" } }),
    prisma.unidad.findMany({
      where: { edificio: { comunidadId } },
      orderBy: { identificador: "asc" },
    }),
  ]);

  return (
    <NuevaReservaForm
      comunidadId={comunidadId}
      basePath={`/admin/comunidades/${comunidadId}/reservas`}
      zonas={zonas}
      unidades={unidades}
      error={error}
    />
  );
}
