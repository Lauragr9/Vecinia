"use client";

import { useActionState } from "react";
import { acceptInviteAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AcceptInviteForm({ token }: { token: string }) {
  const [error, action, pending] = useActionState(acceptInviteAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" required autoComplete="name" placeholder="Tu nombre" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="telefono">Teléfono (opcional)</Label>
        <Input id="telefono" name="telefono" autoComplete="tel" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Elige una contraseña</Label>
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Guardando..." : "Completar registro"}
      </Button>
    </form>
  );
}
