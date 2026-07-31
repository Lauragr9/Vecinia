import { redirect } from "next/navigation";
import { getMemberships, isAdminAnywhere } from "@/lib/dal";

export default async function HomePage() {
  const memberships = await getMemberships();

  if (memberships.length === 0) {
    redirect("/login");
  }

  if (await isAdminAnywhere()) {
    redirect("/admin");
  }

  redirect("/portal");
}
