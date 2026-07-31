import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPortalMembership } from "@/lib/dal";
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Documentos</h1>
        {(membership.role === "ADMIN" || membership.role === "PRESIDENTE") && (
          <Button nativeButton={false} render={<Link href="/portal/documentos/nuevo" />}>+ Subir documento</Button>
        )}
      </div>
      <form method="get" className="max-w-sm">
        <Input name="q" defaultValue={q} placeholder="Buscar por nombre o categoría..." />
      </form>
      <DocumentosList comunidadId={membership.comunidadId} query={q} />
    </div>
  );
}
