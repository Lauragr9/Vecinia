import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { getPortalMembership } from "@/lib/dal";
import { createAnuncioAction } from "@/lib/actions/anuncios";

export default async function NuevoAnuncioPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const membership = await getPortalMembership();
  const basePath = "/portal/anuncios";

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo anuncio</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createAnuncioAction.bind(null, membership.comunidadId, basePath)}
            className="flex flex-col gap-4"
          >
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="titulo">Título</Label>
              <Input id="titulo" name="titulo" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cuerpo">Contenido</Label>
              <Textarea id="cuerpo" name="cuerpo" required rows={5} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Publicar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
