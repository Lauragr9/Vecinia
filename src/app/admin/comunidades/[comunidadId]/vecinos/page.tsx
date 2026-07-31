import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { eliminarVecinoAction } from "./actions";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  PRESIDENTE: "Presidente",
  VECINO: "Vecino",
};

export default async function VecinosPage({
  params,
  searchParams,
}: {
  params: Promise<{ comunidadId: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { comunidadId } = await params;
  const { created } = await searchParams;

  const memberships = await prisma.membership.findMany({
    where: { comunidadId },
    include: { user: true },
    orderBy: { user: { nombre: "asc" } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vecinos</h1>
        <Button nativeButton={false} render={<Link href={`/admin/comunidades/${comunidadId}/vecinos/nuevo`} />}>
          + Nuevo vecino
        </Button>
      </div>

      {created && (
        <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-2 text-sm">
          Vecino creado con email <strong>{created}</strong>. Contraseña temporal:{" "}
          <strong>bienvenido123</strong>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {memberships.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.user.nombre}</TableCell>
              <TableCell>{m.user.email}</TableCell>
              <TableCell>{m.user.telefono ?? "-"}</TableCell>
              <TableCell>
                <Badge variant="secondary">{ROLE_LABELS[m.role]}</Badge>
              </TableCell>
              <TableCell className="text-right">
                {m.role !== "ADMIN" && (
                  <form action={eliminarVecinoAction.bind(null, comunidadId, m.id)}>
                    <Button type="submit" variant="ghost" size="sm">
                      Quitar
                    </Button>
                  </form>
                )}
              </TableCell>
            </TableRow>
          ))}
          {memberships.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Todavía no hay vecinos registrados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
