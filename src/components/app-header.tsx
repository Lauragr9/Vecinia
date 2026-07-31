import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

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
        <div>
          <Link href={homeHref} className="text-lg font-semibold">
            {title}
          </Link>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <LogoutButton />
        </div>
      </div>
      {children && (
        <div className="mx-auto max-w-6xl px-4 pb-2">{children}</div>
      )}
    </header>
  );
}
