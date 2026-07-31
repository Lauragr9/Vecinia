import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
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
      <PageHeader
        title={MODULES.documentos.label}
        icon={MODULES.documentos.icon}
        color={MODULES.documentos.color}
        action={
          <Button nativeButton={false} render={<Link href={`${basePath}/nuevo`} />}>
            <Plus className="size-4" /> Subir documento
          </Button>
        }
      />
      <form method="get" className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por nombre o categoría..." />
      </form>
      <DocumentosList comunidadId={comunidadId} query={q} />
    </div>
  );
}
