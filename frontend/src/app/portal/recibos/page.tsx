import { Receipt } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import type { Recibo } from "@/types/api";
import { getPortalMembership } from "@/lib/dal";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { MODULES } from "@/lib/modules";

export default async function RecibosPortalPage() {
  const membership = await getPortalMembership();

  const recibos = await apiGet<Recibo[]>(`/api/comunidades/${membership.comunidadId}/mis-recibos`);

  const formatEUR = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tus recibos" icon={Receipt} color={MODULES.gastos.color} />

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
              <TableCell>{new Date(r.fechaVencimiento).toLocaleDateString("es-ES")}</TableCell>
              <TableCell className="text-right">{formatEUR(Number(r.importe))}</TableCell>
              <TableCell>
                <Badge variant={r.estado === "PAGADO" ? "success" : "warning"}>
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
