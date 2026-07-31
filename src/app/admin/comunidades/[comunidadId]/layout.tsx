import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { AppHeader } from "@/components/app-header";
import { NavTabs } from "@/components/nav-tabs";

export default async function ComunidadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  const { session } = await requireAdmin(comunidadId);

  const comunidad = await prisma.comunidad.findUnique({ where: { id: comunidadId } });
  if (!comunidad) notFound();

  const base = `/admin/comunidades/${comunidadId}`;

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader
        title={comunidad.nombre}
        subtitle={comunidad.direccion}
        userName={session.user.name ?? session.user.email ?? ""}
        homeHref="/admin"
      >
        <NavTabs
          items={[
            { href: base, label: "Resumen" },
            { href: `${base}/edificios`, label: "Edificios y unidades" },
            { href: `${base}/vecinos`, label: "Vecinos" },
            { href: `${base}/incidencias`, label: "Incidencias" },
            { href: `${base}/reservas`, label: "Reservas" },
            { href: `${base}/votaciones`, label: "Votaciones" },
            { href: `${base}/documentos`, label: "Documentos" },
            { href: `${base}/anuncios`, label: "Anuncios" },
            { href: `${base}/gastos`, label: "Gastos y recibos" },
          ]}
        />
      </AppHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
