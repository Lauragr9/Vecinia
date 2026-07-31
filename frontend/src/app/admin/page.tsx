import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { getSession, getMemberships } from "@/lib/dal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default async function AdminHomePage() {
  const session = await getSession();
  const memberships = await getMemberships();
  const comunidades = memberships.filter((m) => m.role === "ADMIN");

  return (
    <>
      <AppHeader
        title="Panel de administrador"
        userName={session.user.nombre ?? session.user.email ?? ""}
        homeHref="/admin"
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Tus comunidades"
            icon={Building2}
            color="var(--primary)"
            action={
              <Button nativeButton={false} render={<Link href="/admin/comunidades/nueva" />}>
                <Plus className="size-4" /> Nueva comunidad
              </Button>
            }
          />

          {comunidades.length === 0 ? (
            <EmptyState icon={Building2} message="Todavía no gestionas ninguna comunidad." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comunidades.map((m) => (
                <Link key={m.comunidadId} href={`/admin/comunidades/${m.comunidadId}`}>
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-5" />
                      </span>
                      <div>
                        <CardTitle>{m.comunidad.nombre}</CardTitle>
                        <CardDescription>{m.comunidad.direccion}</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
