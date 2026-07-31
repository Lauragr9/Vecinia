import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortalMembership } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { AnunciosList } from "@/components/anuncios/anuncios-list";

export default async function AnunciosPortalPage() {
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.anuncios.label}
        icon={MODULES.anuncios.icon}
        color={MODULES.anuncios.color}
        action={
          (membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
            <Button nativeButton={false} render={<Link href="/portal/anuncios/nuevo" />}>
              <Plus className="size-4" /> Nuevo anuncio
            </Button>
          )
        }
      />
      <AnunciosList comunidadId={membership.comunidadId} />
    </div>
  );
}
