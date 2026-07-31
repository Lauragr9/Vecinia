import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { FormError } from "@/components/form-error";
import { getPortalMembership } from "@/lib/dal";
import { uploadDocumentoAction } from "@/lib/actions/documentos";

const CATEGORIAS = ["Estatutos", "Actas", "Contratos", "Seguros", "Presupuestos", "Certificados", "Otros"];

export default async function NuevoDocumentoPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const membership = await getPortalMembership();
  const basePath = "/portal/documentos";

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Subir documento</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={uploadDocumentoAction.bind(null, membership.comunidadId, basePath)}
            className="flex flex-col gap-4"
           
          >
            <FormError message={error} />
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoría</Label>
              <NativeSelect id="categoria" name="categoria" defaultValue={CATEGORIAS[0]}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="archivo">Archivo</Label>
              <Input id="archivo" name="archivo" type="file" required />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" nativeButton={false} render={<Link href={basePath} />}>
                Cancelar
              </Button>
              <Button type="submit">Subir</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
