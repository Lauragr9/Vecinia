import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import type { MovimientoContable } from "@/types/api";
import { requireMembership, getPortalMembership } from "@/lib/dal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { MODULES } from "@/lib/modules";
import { GastosChart } from "@/components/gastos/gastos-chart";

export default async function GastosPortalPage() {
  const membership = await getPortalMembership();
  await requireMembership(membership.comunidadId, ["ADMIN", "PRESIDENTE"]);

  const movimientos = await apiGet<MovimientoContable[]>(`/api/comunidades/${membership.comunidadId}/movimientos`);

  const totalIngresos = movimientos
    .filter((m) => m.tipo === "INGRESO")
    .reduce((sum, m) => sum + Number(m.importe), 0);
  const totalGastos = movimientos
    .filter((m) => m.tipo === "GASTO")
    .reduce((sum, m) => sum + Number(m.importe), 0);
  const fondoReserva = totalIngresos - totalGastos;

  const porMes = new Map<string, { mes: string; ingresos: number; gastos: number }>();
  for (const m of [...movimientos].reverse()) {
    const fecha = new Date(m.fecha);
    const key = format(fecha, "yyyy-MM");
    const label = format(fecha, "MMM yy", { locale: es });
    if (!porMes.has(key)) porMes.set(key, { mes: label, ingresos: 0, gastos: 0 });
    const entry = porMes.get(key)!;
    if (m.tipo === "INGRESO") entry.ingresos += Number(m.importe);
    else entry.gastos += Number(m.importe);
  }
  const chartData = Array.from(porMes.values());
  const formatEUR = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Gastos de la comunidad" icon={MODULES.gastos.icon} color={MODULES.gastos.color} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Ingresos" value={formatEUR(totalIngresos)} icon={TrendingUp} color="var(--status-good)" />
        <StatCard label="Gastos" value={formatEUR(totalGastos)} icon={TrendingDown} color="var(--status-critical)" />
        <StatCard label="Fondo de reserva" value={formatEUR(fondoReserva)} icon={PiggyBank} color="var(--primary)" />
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparativa mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <GastosChart data={chartData} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Movimientos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Importe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimientos.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{new Date(m.fecha).toLocaleDateString("es-ES")}</TableCell>
                  <TableCell>{m.concepto}</TableCell>
                  <TableCell>{m.tipo === "INGRESO" ? "Ingreso" : "Gasto"}</TableCell>
                  <TableCell className="text-right">{formatEUR(Number(m.importe))}</TableCell>
                </TableRow>
              ))}
              {movimientos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Sin movimientos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
