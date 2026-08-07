"use client";

import { useState } from "react";
import { deleteAdmin } from "@/actions/admin";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  OPERATOR: "Operator",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-amber-50 text-amber-700 border-amber-200",
  ADMIN: "bg-sky-50 text-sky-700 border-sky-200",
  OPERATOR: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function UserList({
  admins,
  currentUserId,
  currentUserRole,
}: {
  admins: AdminUser[];
  currentUserId: string;
  currentUserRole: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(adminId: string) {
    if (!confirm("Are you sure you want to remove this user?")) return;

    setDeletingId(adminId);
    setError(null);
    const result = await deleteAdmin(adminId);
    if (result?.error) setError(result.error);
    setDeletingId(null);
  }

  // Super admin can delete anyone except themselves
  // Admin can only view the team, not delete
  function canDelete(admin: AdminUser) {
    if (admin.id === currentUserId) return false;
    if (currentUserRole === "SUPER_ADMIN") return true;
    return false;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e0d5] bg-white">
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-col divide-y divide-[#e5e0d5]/60">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#012340]/10 text-sm font-bold text-[#012340]">
                {admin.name[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0a1628]">
                    {admin.name}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                      ROLE_COLORS[admin.role] || "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {ROLE_LABELS[admin.role] || admin.role}
                  </span>
                  {admin.id === currentUserId && (
                    <span className="rounded-full bg-[#012340]/5 px-2 py-0.5 text-[10px] font-medium text-[#012340]/60">
                      You
                    </span>
                  )}
                </div>
                <span className="text-sm text-[#0a1628]/50">{admin.email}</span>
              </div>
            </div>

            {canDelete(admin) && (
              <button
                type="button"
                onClick={() => handleDelete(admin.id)}
                disabled={deletingId === admin.id}
                className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === admin.id ? "..." : "Remove"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
