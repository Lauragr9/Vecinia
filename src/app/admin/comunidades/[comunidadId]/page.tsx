import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function ComunidadResumenPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  const [edificios, unidades, incidenciasAbiertas, recibosPendientes, vecinos] = await Promise.all([
    prisma.edificio.count({ where: { comunidadId } }),
    prisma.unidad.count({ where: { edificio: { comunidadId } } }),
    prisma.incidencia.count({ where: { comunidadId, estado: { not: "RESUELTO" } } }),
    prisma.recibo.count({ where: { unidad: { edificio: { comunidadId } }, estado: "PENDIENTE" } }),
    prisma.membership.count({ where: { comunidadId, role: { in: ["VECINO", "PRESIDENTE"] } } }),
  ]);

  const stats = [
    { label: "Edificios", value: edificios, href: `/admin/comunidades/${comunidadId}/edificios` },
    { label: "Unidades", value: unidades, href: `/admin/comunidades/${comunidadId}/edificios` },
    { label: "Vecinos", value: vecinos, href: `/admin/comunidades/${comunidadId}/vecinos` },
    {
      label: "Incidencias abiertas",
      value: incidenciasAbiertas,
      href: `/admin/comunidades/${comunidadId}/incidencias`,
    },
    {
      label: "Recibos pendientes",
      value: recibosPendientes,
      href: `/admin/comunidades/${comunidadId}/gastos`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <Card className="h-full transition-colors hover:border-primary">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
