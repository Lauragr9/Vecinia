import { prisma } from "@/lib/prisma";
import { getPortalMembership, getMisUnidades } from "@/lib/dal";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function RecibosPortalPage() {
  const membership = await getPortalMembership();
  const unidades = await getMisUnidades(membership.comunidadId);
  const unidadIds = unidades.map((u) => u.id);

  const recibos = unidadIds.length
    ? await prisma.recibo.findMany({
        where: { unidadId: { in: unidadIds } },
        include: { unidad: true },
        orderBy: { fechaVencimiento: "desc" },
      })
    : [];

  const formatEUR = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tus recibos</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Unidad</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead className="text-right">Importe</TableHead>
            <TableHead>Estado</TableHead>
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
            </TableRow>
          ))}
          {recibos.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No tienes recibos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
