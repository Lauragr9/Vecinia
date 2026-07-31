import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GastosChart } from "@/components/gastos/gastos-chart";

export default async function GastosAdminPage({
  params,
}: {
  params: Promise<{ comunidadId: string }>;
}) {
  const { comunidadId } = await params;

  const movimientos = await prisma.movimientoContable.findMany({
    where: { comunidadId },
    orderBy: { fecha: "desc" },
  });

  const totalIngresos = movimientos
    .filter((m) => m.tipo === "INGRESO")
    .reduce((sum, m) => sum + Number(m.importe), 0);
  const totalGastos = movimientos
    .filter((m) => m.tipo === "GASTO")
    .reduce((sum, m) => sum + Number(m.importe), 0);
  const fondoReserva = totalIngresos - totalGastos;

  const porMes = new Map<string, { mes: string; ingresos: number; gastos: number }>();
  for (const m of [...movimientos].reverse()) {
    const key = format(m.fecha, "yyyy-MM");
    const label = format(m.fecha, "MMM yy", { locale: es });
    if (!porMes.has(key)) porMes.set(key, { mes: label, ingresos: 0, gastos: 0 });
    const entry = porMes.get(key)!;
    if (m.tipo === "INGRESO") entry.ingresos += Number(m.importe);
    else entry.gastos += Number(m.importe);
  }
  const chartData = Array.from(porMes.values());

  const basePath = `/admin/comunidades/${comunidadId}/gastos`;
  const formatEUR = (n: number) => n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gastos y contabilidad</h1>
        <div className="flex gap-2">
          <Button variant="outline" nativeButton={false} render={<Link href={`${basePath}/recibos`} />}>
            Recibos
          </Button>
          <Button nativeButton={false} render={<Link href={`${basePath}/nuevo`} />}>+ Movimiento</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Ingresos</CardDescription>
            <CardTitle className="text-2xl text-emerald-600 dark:text-emerald-400">
              {formatEUR(totalIngresos)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Gastos</CardDescription>
            <CardTitle className="text-2xl text-destructive">{formatEUR(totalGastos)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Fondo de reserva</CardDescription>
            <CardTitle className="text-2xl">{formatEUR(fondoReserva)}</CardTitle>
          </CardHeader>
        </Card>
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
                  <TableCell>{m.fecha.toLocaleDateString("es-ES")}</TableCell>
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
