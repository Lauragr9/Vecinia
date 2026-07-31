import Link from "next/link";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIPO_LABELS: Record<string, string> = { VIVIENDA: "Vivienda", GARAJE: "Garaje", TRASTERO: "Trastero" };

export default async function PortalInicioPage() {
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);

  const anuncios = await prisma.anuncio.findMany({
    where: { comunidadId: membership.comunidadId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Hola de nuevo</h1>
        <p className="text-muted-foreground">Esto es lo último en {membership.comunidad.nombre}.</p>
      </div>

      <Card>
        <CardHeader>
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
        <CardHeader>
          <CardTitle className="text-base">Últimos anuncios</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {anuncios.length === 0 && <p className="text-sm text-muted-foreground">No hay anuncios todavía.</p>}
          {anuncios.map((a) => (
            <div key={a.id}>
              <p className="font-medium">{a.titulo}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.cuerpo}</p>
            </div>
          ))}
          <Link href="/portal/anuncios" className="text-sm text-primary hover:underline">
            Ver todos los anuncios →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
