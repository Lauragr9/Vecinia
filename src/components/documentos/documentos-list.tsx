import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export async function DocumentosList({ comunidadId, query }: { comunidadId: string; query?: string }) {
  const documentos = await prisma.documento.findMany({
    where: {
      comunidadId,
      ...(query
        ? {
            OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { categoria: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documentos.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <a href={doc.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                {doc.nombre}
              </a>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{doc.categoria}</Badge>
            </TableCell>
            <TableCell>{doc.createdAt.toLocaleDateString("es-ES")}</TableCell>
          </TableRow>
        ))}
        {documentos.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              No se han encontrado documentos.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
