import { Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at 15% 10%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 55%), radial-gradient(circle at 85% 90%, color-mix(in oklch, var(--module-5) 14%, transparent), transparent 55%), var(--background)",
      }}
    >
      <Card className="w-full max-w-sm border-none shadow-xl shadow-primary/5">
        <CardHeader className="items-center text-center">
          <span className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Home className="size-6" />
          </span>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
