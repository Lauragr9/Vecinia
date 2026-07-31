import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPortalMembership } from "@/lib/dal";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";
import { DocumentosList } from "@/components/documentos/documentos-list";

export default async function DocumentosPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const membership = await getPortalMembership();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={MODULES.documentos.label}
        icon={MODULES.documentos.icon}
        color={MODULES.documentos.color}
        action={
          (membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
            <Button nativeButton={false} render={<Link href="/portal/documentos/nuevo" />}>
              <Plus className="size-4" /> Subir documento
            </Button>
          )
        }
      />
      <form method="get" className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por nombre o categoría..." />
      </form>
      <DocumentosList comunidadId={membership.comunidadId} query={q} />
    </div>
  );
}
