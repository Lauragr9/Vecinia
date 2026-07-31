import { notFound } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { requireAdmin, getSession } from "@/lib/dal";
import { apiGet, ApiError } from "@/lib/api-client";
import type { Comunidad } from "@/types/api";
import { AppHeader } from "@/components/app-header";
import { NavTabs } from "@/components/nav-tabs";
import { MODULES } from "@/lib/modules";

export default async function ComunidadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  await requireAdmin(comunidadId);
  const session = await getSession();

  let comunidad: Comunidad;
  try {
    comunidad = await apiGet<Comunidad>(`/api/comunidades/${comunidadId}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const base = `/admin/comunidades/${comunidadId}`;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader
        title={comunidad.nombre}
        subtitle={comunidad.direccion}
        userName={session.user.nombre ?? session.user.email ?? ""}
        homeHref="/admin"
      >
        <NavTabs
          items={[
            { href: base, label: "Resumen", icon: <LayoutGrid className="size-4" /> },
            { href: `${base}/edificios`, label: MODULES.edificios.label, icon: <MODULES.edificios.icon className="size-4" />, color: MODULES.edificios.color },
            { href: `${base}/vecinos`, label: MODULES.vecinos.label, icon: <MODULES.vecinos.icon className="size-4" />, color: MODULES.vecinos.color },
            { href: `${base}/incidencias`, label: MODULES.incidencias.label, icon: <MODULES.incidencias.icon className="size-4" />, color: MODULES.incidencias.color },
            { href: `${base}/reservas`, label: MODULES.reservas.label, icon: <MODULES.reservas.icon className="size-4" />, color: MODULES.reservas.color },
            { href: `${base}/votaciones`, label: MODULES.votaciones.label, icon: <MODULES.votaciones.icon className="size-4" />, color: MODULES.votaciones.color },
            { href: `${base}/documentos`, label: MODULES.documentos.label, icon: <MODULES.documentos.icon className="size-4" />, color: MODULES.documentos.color },
            { href: `${base}/anuncios`, label: MODULES.anuncios.label, icon: <MODULES.anuncios.icon className="size-4" />, color: MODULES.anuncios.color },
            { href: `${base}/gastos`, label: MODULES.gastos.label, icon: <MODULES.gastos.icon className="size-4" />, color: MODULES.gastos.color },
          ]}
        />
      </AppHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
