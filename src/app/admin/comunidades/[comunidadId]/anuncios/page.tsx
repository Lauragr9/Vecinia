import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnunciosList } from "@/components/anuncios/anuncios-list";

export default async function AnunciosAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Anuncios</h1>
        <Button nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/anuncios/nuevo`} />}>
          + Nuevo anuncio
        </Button>
      </div>
      <AnunciosList comunidadId={comunidadId} />
    </div>
  );
}
