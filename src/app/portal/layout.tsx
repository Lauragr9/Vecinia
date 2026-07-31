import { getSession, getPortalMembership } from "@/lib/dal";
import { AppHeader } from "@/components/app-header";
import { NavTabs } from "@/components/nav-tabs";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const membership = await getPortalMembership();

  const items = [
    { href: "/portal", label: "Inicio" },
    { href: "/portal/incidencias", label: "Incidencias" },
    { href: "/portal/reservas", label: "Reservas" },
    { href: "/portal/votaciones", label: "Votaciones" },
    { href: "/portal/documentos", label: "Documentos" },
    { href: "/portal/anuncios", label: "Anuncios" },
    { href: "/portal/recibos", label: "Recibos" },
  ];

  if (membership.role === "PRESIDENTE" || membership.role === "ADMIN") {
    items.push({ href: "/portal/gastos", label: "Gastos" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <AppHeader
        title={membership.comunidad.nombre}
        subtitle={membership.comunidad.direccion}
        userName={session.user.name ?? session.user.email ?? ""}
        homeHref="/portal"
      >
        <NavTabs items={items} />
      </AppHeader>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
