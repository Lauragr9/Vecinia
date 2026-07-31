import { notFound } from "next/navigation";
import { apiGet, fileUrl, ApiError } from "@/lib/api-client";
import type { Incidencia } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import {
  cambiarEstadoIncidenciaAction,
  comentarIncidenciaAction,
} from "@/lib/actions/incidencias";

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En proceso",
  RESUELTO: "Resuelto",
};

const ESTADO_VARIANTS: Record<string, "warning" | "default" | "success"> = {
  PENDIENTE: "warning",
  EN_PROCESO: "default",
  RESUELTO: "success",
};

export async function IncidenciaDetail({
  comunidadId,
  incidenciaId,
  basePath,
  canManage,
}: {
  comunidadId: string;
  incidenciaId: string;
  basePath: string;
  canManage: boolean;
}) {
  let incidencia: Incidencia;
  try {
    incidencia = await apiGet<Incidencia>(`/api/incidencias/${incidenciaId}`);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) notFound();
    throw error;
  }

  const returnTo = `${basePath}/${incidenciaId}`;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>{incidencia.titulo}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {incidencia.unidad ? `${incidencia.unidad.identificador} · ` : ""}
              Creada por {incidencia.creadoPor.nombre} el{" "}
              {new Date(incidencia.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
          <Badge variant={ESTADO_VARIANTS[incidencia.estado]}>{ESTADO_LABELS[incidencia.estado]}</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>{incidencia.descripcion}</p>

          {incidencia.fotos.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {incidencia.fotos.map((foto) => (
                <a key={foto} href={fileUrl(foto)} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element -- host servido por el backend, fuera del optimizador de imágenes */}
                  <img
                    src={fileUrl(foto)}
                    alt="Foto de la incidencia"
                    width={120}
                    height={120}
                    className="h-[120px] w-[120px] rounded-md border object-cover"
                  />
                </a>
              ))}
            </div>
          )}

          {canManage && (
            <form
              action={cambiarEstadoIncidenciaAction.bind(null, comunidadId, incidenciaId, returnTo)}
              className="flex items-end gap-2"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="estado" className="text-xs font-medium text-muted-foreground">
                  Cambiar estado
                </label>
                <NativeSelect id="estado" name="estado" defaultValue={incidencia.estado} className="w-48">
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="RESUELTO">Resuelto</option>
                </NativeSelect>
              </div>
              <Button type="submit" size="sm">
                Actualizar
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Seguimiento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {(incidencia.comentarios ?? []).map((c) => (
            <div key={c.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{c.autor.nombre}</p>
              <p className="text-muted-foreground">{c.texto}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleString("es-ES")}
              </p>
            </div>
          ))}
          {(incidencia.comentarios ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Sin comentarios todavía.</p>
          )}

          <form
            action={comentarIncidenciaAction.bind(null, comunidadId, incidenciaId, returnTo)}
            className="flex flex-col gap-2"
          >
            <Textarea name="texto" placeholder="Añadir un comentario..." required />
            <Button type="submit" size="sm" className="self-end">
              Comentar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
