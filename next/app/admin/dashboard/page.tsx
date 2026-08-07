export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLeads, getOperators, getActiveClockRecord } from "@/actions/admin";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  const userId = session.user.id!;

  // Check clock-in status for operators
  let clockedIn = true; // default true for admin/super_admin
  let activeClockRecordId: string | null = null;
  if (role === "OPERATOR") {
    const record = await getActiveClockRecord();
    clockedIn = !!record;
    activeClockRecordId = record?.id ?? null;
  }

  const leads = await getLeads();
  const operators = role !== "OPERATOR" ? await getOperators() : [];

  return (
    <DashboardClient
      leads={JSON.parse(JSON.stringify(leads))}
      operators={JSON.parse(JSON.stringify(operators))}
      role={role}
      userId={userId}
      clockedIn={clockedIn}
      activeClockRecordId={activeClockRecordId}
    />
  );
}
