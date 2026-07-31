import {
  Building2,
  Users,
  TriangleAlert,
  CalendarDays,
  Vote,
  FileText,
  Megaphone,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ModuleKey =
  | "edificios"
  | "vecinos"
  | "incidencias"
  | "reservas"
  | "votaciones"
  | "documentos"
  | "anuncios"
  | "gastos";

interface ModuleInfo {
  label: string;
  icon: LucideIcon;
  color: string;
}

export const MODULES: Record<ModuleKey, ModuleInfo> = {
  edificios: { label: "Edificios y unidades", icon: Building2, color: "var(--module-1)" },
  vecinos: { label: "Vecinos", icon: Users, color: "var(--module-2)" },
  incidencias: { label: "Incidencias", icon: TriangleAlert, color: "var(--module-3)" },
  reservas: { label: "Reservas", icon: CalendarDays, color: "var(--module-4)" },
  votaciones: { label: "Votaciones", icon: Vote, color: "var(--module-5)" },
  documentos: { label: "Documentos", icon: FileText, color: "var(--module-6)" },
  anuncios: { label: "Anuncios", icon: Megaphone, color: "var(--module-7)" },
  gastos: { label: "Gastos y recibos", icon: Wallet, color: "var(--module-8)" },
};
