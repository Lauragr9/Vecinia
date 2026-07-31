import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { AnunciosList } from "@/components/anuncios/anuncios-list";

export default async function AnunciosAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.anuncios.label}
        icon={MODULES.anuncios.icon}
        color={MODULES.anuncios.color}
        action={
          <Button nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/anuncios/nuevo`} />}>
            <Plus className="size-4" /> Nuevo anuncio
          </Button>
        }
      />
      <AnunciosList comunidadId={comunidadId} />
    </div>
  );
}
