export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdmins } from "@/actions/admin";
import UserList from "./user-list";
import AddUserForm from "./add-user-form";

export default async function AdminsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const admins = await getAdmins();

  return (
    <div className="px-6 py-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0a1628]">Team</h1>
        <p className="mt-0.5 text-sm text-[#0a1628]/50">
          Manage admins and operators
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <UserList
          admins={JSON.parse(JSON.stringify(admins))}
          currentUserId={session.user.id!}
          currentUserRole={role}
        />
        {role === "SUPER_ADMIN" && <AddUserForm />}
      </div>
    </div>
  );
}
