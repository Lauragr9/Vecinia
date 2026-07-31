import type { LucideIcon } from "lucide-react";

export function PageHeader({
  title,
  icon: Icon,
  color,
  action,
}: {
  title: string;
  icon?: LucideIcon;
  color?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
          >
            <Icon className="size-5" />
          </span>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      {action}
    </div>
  );
}
