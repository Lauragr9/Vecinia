import Link from "next/link";
import { Home } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AppHeader({
  title,
  subtitle,
  userName,
  homeHref,
  children,
}: {
  title: string;
  subtitle?: string;
  userName: string;
  homeHref: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Home className="size-5" />
          </span>
          <div>
            <Link href={homeHref} className="text-lg font-semibold leading-tight">
              {title}
            </Link>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className="bg-accent text-accent-foreground">{initials(userName)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm text-muted-foreground sm:inline">{userName}</span>
          <LogoutButton />
        </div>
      </div>
      {children && <div className="mx-auto max-w-6xl px-4 pb-2">{children}</div>}
    </header>
  );
}
