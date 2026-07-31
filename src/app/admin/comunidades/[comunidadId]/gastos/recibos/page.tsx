import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toggleReciboEstadoAction } from "@/lib/actions/gastos";

export default async function RecibosAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;
  const basePath = `/admin/comunidades/${comunidadId}/gastos/recibos`;

  const recibos = await prisma.recibo.findMany({
    where: { unidad: { edificio: { comunidadId } } },
    include: { unidad: true },
    orderBy: { fechaVencimiento: "desc" },
  });

  const formatEUR = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Recibos</h1>
        <Button nativeButton={false} render={<Link href={`${basePath}/nuevo`} />}>+ Nuevo recibo</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidad</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-right">Importe</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recibos.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.unidad.identificador}</TableCell>
              <TableCell>{r.concepto}</TableCell>
              <TableCell>{r.fechaVencimiento.toLocaleDateString("es-ES")}</TableCell>
              <TableCell className="text-right">{formatEUR(Number(r.importe))}</TableCell>
              <TableCell>
                <Badge variant={r.estado === "PAGADO" ? "secondary" : "destructive"}>
                  {r.estado === "PAGADO" ? "Pagado" : "Pendiente"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <form action={toggleReciboEstadoAction.bind(null, comunidadId, r.id, basePath)}>
                  <Button type="submit" variant="ghost" size="sm">
                    Marcar {r.estado === "PAGADO" ? "pendiente" : "pagado"}
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {recibos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Sin recibos todavía.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
