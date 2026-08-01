import { redirect } from "next/navigation";
import { getMemberships } from "@/lib/dal";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const memberships = await getMemberships();
  const isAdmin = memberships.some((m) => m.role === "ADMIN");

  // Deja pasar tanto a administradores como a cuentas recién creadas sin
  // ninguna comunidad todavía (su único destino útil aquí es crear la primera).
  // Solo se aparta a quien SÍ pertenece a alguna comunidad pero no como admin.
  if (memberships.length > 0 && !isAdmin) {
    redirect("/portal");
  }

  return <div className="min-h-screen bg-muted/20">{children}</div>;
}
