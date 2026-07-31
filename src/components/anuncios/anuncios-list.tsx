import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function AnunciosList({ comunidadId }: { comunidadId: string }) {
  const anuncios = await prisma.anuncio.findMany({
    where: { comunidadId },
    include: { autor: true },
    orderBy: { createdAt: "desc" },
  });

  if (anuncios.length === 0) {
    return <p className="text-muted-foreground">No hay anuncios todavía.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {anuncios.map((anuncio) => (
        <Card key={anuncio.id}>
          <CardHeader>
            <CardTitle className="text-base">{anuncio.titulo}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {anuncio.autor.nombre} · {anuncio.createdAt.toLocaleDateString("es-ES")}
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
