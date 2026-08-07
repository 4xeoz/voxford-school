import type { Metadata } from "next";
import { auth } from "@/auth";
import AdminShell from "./components/admin-shell";

export const metadata: Metadata = {
  title: "Admin | Nopeca",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <AdminShell
      role={(session?.user as { role?: string } | undefined)?.role ?? null}
      name={session?.user?.name ?? null}
      email={session?.user?.email ?? null}
    >
      {children}
    </AdminShell>
  );
}
