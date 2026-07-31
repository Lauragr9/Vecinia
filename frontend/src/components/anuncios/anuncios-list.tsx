import { apiGet } from "@/lib/api-client";
import type { Anuncio } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { MODULES } from "@/lib/modules";

export async function AnunciosList({ comunidadId }: { comunidadId: string }) {
  const anuncios = await apiGet<Anuncio[]>(`/api/comunidades/${comunidadId}/anuncios`);

  if (anuncios.length === 0) {
    return <EmptyState icon={MODULES.anuncios.icon} message="No hay anuncios todavía." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {anuncios.map((anuncio) => (
        <Card key={anuncio.id}>
          <CardHeader>
            <CardTitle className="text-base">{anuncio.titulo}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {anuncio.autor.nombre} · {new Date(anuncio.createdAt).toLocaleDateString("es-ES")}
            </p>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{anuncio.cuerpo}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
