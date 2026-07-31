import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </div>
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
        >
          <Icon className="size-5" />
        </span>
      </CardHeader>
    </Card>
  );
}
