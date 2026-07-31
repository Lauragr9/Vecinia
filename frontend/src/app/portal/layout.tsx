import { LayoutGrid, Receipt } from "lucide-react";
import { getSession, getPortalMembership } from "@/lib/dal";
import { AppHeader } from "@/components/app-header";
import { NavTabs, type NavTabItem } from "@/components/nav-tabs";
import { MODULES } from "@/lib/modules";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const membership = await getPortalMembership();

  const items: NavTabItem[] = [
    { href: "/portal", label: "Inicio", icon: <LayoutGrid className="size-4" /> },
    { href: "/portal/incidencias", label: MODULES.incidencias.label, icon: <MODULES.incidencias.icon className="size-4" />, color: MODULES.incidencias.color },
    { href: "/portal/reservas", label: MODULES.reservas.label, icon: <MODULES.reservas.icon className="size-4" />, color: MODULES.reservas.color },
    { href: "/portal/votaciones", label: MODULES.votaciones.label, icon: <MODULES.votaciones.icon className="size-4" />, color: MODULES.votaciones.color },
    { href: "/portal/documentos", label: MODULES.documentos.label, icon: <MODULES.documentos.icon className="size-4" />, color: MODULES.documentos.color },
    { href: "/portal/anuncios", label: MODULES.anuncios.label, icon: <MODULES.anuncios.icon className="size-4" />, color: MODULES.anuncios.color },
    { href: "/portal/recibos", label: "Recibos", icon: <Receipt className="size-4" />, color: MODULES.gastos.color },
  ];

  if (membership.role === "PRESIDENTE" || membership.role === "ADMIN") {
    items.push({ href: "/portal/gastos", label: "Gastos", icon: <MODULES.gastos.icon className="size-4" />, color: MODULES.gastos.color });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader
        title={membership.comunidad.nombre}
        subtitle={membership.comunidad.direccion}
        userName={session.user.nombre ?? session.user.email ?? ""}
        homeHref="/portal"
      >
        <NavTabs items={items} />
      </AppHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
