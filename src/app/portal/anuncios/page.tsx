import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPortalMembership } from "@/lib/dal";
import { AnunciosList } from "@/components/anuncios/anuncios-list";

export default async function AnunciosPortalPage() {
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Anuncios</h1>
        {(membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
          <Button nativeButton={false} render={<Link href="/portal/anuncios/nuevo" />}>+ Nuevo anuncio</Button>
        )}
      </div>
      <AnunciosList comunidadId={membership.comunidadId} />
    </div>
  );
}
