import { redirect } from "next/navigation";
import { isAdminAnywhere } from "@/lib/dal";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAnywhere())) {
    redirect("/portal");
  }

  return <div className="min-h-screen bg-muted/20">{children}</div>;
}
