import Link from "next/link";
import { Building2, Home, TriangleAlert, Users, Wallet } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import type { ComunidadStats } from "@/types/api";
import { StatCard } from "@/components/stat-card";
import { MODULES } from "@/lib/modules";

export default async function ComunidadResumenPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  const { edificios, unidades, incidenciasAbiertas, recibosPendientes, vecinos } = await apiGet<ComunidadStats>(
    `/api/comunidades/${comunidadId}/stats`
  );

  const stats = [
    {
      label: "Edificios",
      value: edificios,
      href: `/admin/comunidades/${comunidadId}/edificios`,
      icon: Building2,
      color: MODULES.edificios.color,
    },
    {
      label: "Unidades",
      value: unidades,
      href: `/admin/comunidades/${comunidadId}/edificios`,
      icon: Home,
      color: MODULES.edificios.color,
    },
    {
      label: "Vecinos",
      value: vecinos,
      href: `/admin/comunidades/${comunidadId}/vecinos`,
      icon: Users,
      color: MODULES.vecinos.color,
    },
    {
      label: "Incidencias abiertas",
      value: incidenciasAbiertas,
      href: `/admin/comunidades/${comunidadId}/incidencias`,
      icon: TriangleAlert,
      color: MODULES.incidencias.color,
    },
    {
      label: "Recibos pendientes",
      value: recibosPendientes,
      href: `/admin/comunidades/${comunidadId}/gastos`,
      icon: Wallet,
      color: MODULES.gastos.color,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <Link key={stat.label} href={stat.href}>
          <StatCard label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
        </Link>
      ))}
    </div>
  );
}
