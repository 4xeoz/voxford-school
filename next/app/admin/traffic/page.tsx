export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTrafficStats } from "@/actions/admin";
import TrafficClient from "./traffic-client";

export default async function TrafficPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const stats = await getTrafficStats("connect");

  return <TrafficClient stats={JSON.parse(JSON.stringify(stats))} />;
}
