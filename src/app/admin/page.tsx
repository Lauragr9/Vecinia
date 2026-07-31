import Link from "next/link";
import { getSession, getMemberships } from "@/lib/dal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";

export default async function AdminHomePage() {
  const session = await getSession();
  const memberships = await getMemberships();
  const comunidades = memberships.filter((m) => m.role === "ADMIN");

  return (
    <>
      <AppHeader
        title="Panel de administrador"
        userName={session.user.name ?? session.user.email ?? ""}
        homeHref="/admin"
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Tus comunidades</h1>
            <Button nativeButton={false} render={<Link href="/admin/comunidades/nueva" />}>
              + Nueva comunidad
            </Button>
          </div>

          {comunidades.length === 0 ? (
            <p className="text-muted-foreground">Todavía no gestionas ninguna comunidad.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comunidades.map((m) => (
                <Link key={m.comunidadId} href={`/admin/comunidades/${m.comunidadId}`}>
                  <Card className="h-full transition-colors hover:border-primary">
                    <CardHeader>
                      <CardTitle>{m.comunidad.nombre}</CardTitle>
                      <CardDescription>{m.comunidad.direccion}</CardDescription>
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
