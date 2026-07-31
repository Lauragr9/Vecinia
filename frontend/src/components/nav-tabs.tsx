"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface NavTabItem {
  href: string;
  label: string;
  icon?: ReactNode;
  color?: string;
}

export function NavTabs({ items }: { items: NavTabItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            style={
              active
                ? {
                    backgroundColor: item.color ? `color-mix(in oklch, ${item.color} 14%, transparent)` : undefined,
                    color: item.color,
                  }
                : undefined
            }
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
