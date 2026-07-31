import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentosList } from "@/components/documentos/documentos-list";

export default async function DocumentosAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { comunidadId } = await params;
  const { q } = await searchParams;
  const basePath = `/admin/comunidades/${comunidadId}/documentos`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documentos</h1>
        <Button nativeButton={false} render={<Link href={`${basePath}/nuevo`} />}>+ Subir documento</Button>
      </div>
      <form method="get" className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por nombre o categoría..." />
      </form>
      <DocumentosList comunidadId={comunidadId} query={q} />
    </div>
  );
}
