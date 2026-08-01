import { redirect } from "next/navigation";
import { getMemberships } from "@/lib/dal";

export default async function HomePage() {
  const memberships = await getMemberships();

  // Cuenta recién creada (p.ej. administrador que acaba de registrarse):
  // todavía no pertenece a ninguna comunidad, así que su único paso posible
  // es crear la primera.
  if (memberships.length === 0) {
    redirect("/admin/comunidades/nueva");
  }

  if (memberships.some((m) => m.role === "ADMIN")) {
    redirect("/admin");
  }

  redirect("/portal");
}
