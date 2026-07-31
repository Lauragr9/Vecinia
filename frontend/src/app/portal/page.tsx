import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { apiGet } from "@/lib/api-client";
import type { Anuncio } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { MODULES } from "@/lib/modules";

const TIPO_LABELS: Record<string, string> = { VIVIENDA: "Vivienda", GARAJE: "Garaje", TRASTERO: "Trastero" };

export default async function PortalInicioPage() {
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);

  const todosAnuncios = await apiGet<Anuncio[]>(`/api/comunidades/${membership.comunidadId}/anuncios`);
  const anuncios = todosAnuncios.slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Hola de nuevo</h1>
        <p className="text-muted-foreground">Esto es lo último en {membership.comunidad.nombre}.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <HomeIcon className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">Tus unidades</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {unidades.length === 0 && <p className="text-sm text-muted-foreground">No tienes unidades asignadas.</p>}
          {unidades.map((u) => (
            <Badge key={u.id} variant="secondary">
              {u.identificador} · {TIPO_LABELS[u.tipo]}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <MODULES.anuncios.icon className="size-4" style={{ color: MODULES.anuncios.color }} />
          <CardTitle className="text-base">Últimos anuncios</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {anuncios.length === 0 && <EmptyState icon={MODULES.anuncios.icon} message="No hay anuncios todavía." />}
          {anuncios.map((a) => (
            <div key={a.id}>
              <p className="font-medium">{a.titulo}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.cuerpo}</p>
            </div>
          ))}
          <Link href="/portal/anuncios" className="text-sm font-medium text-primary hover:underline">
            Ver todos los anuncios →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
