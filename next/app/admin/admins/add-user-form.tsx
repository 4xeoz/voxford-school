"use client";

import { useActionState } from "react";
import { createAdmin } from "@/actions/admin";

export default function AddUserForm() {
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: { error?: string; success?: boolean } | undefined,
      formData: FormData
    ) => {
      return await createAdmin(formData);
    },
    undefined
  );

  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-ink">Add New User</h3>
      <form
        action={formAction}
        className="flex flex-col gap-4 rounded-xl border border-hairline bg-white p-5"
      >
        {state?.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}
        {state?.success && (
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            User added successfully.
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-semibold text-ink/70"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>

        <div>
          <label
            htmlFor="user-email"
            className="mb-1.5 block text-xs font-semibold text-ink/70"
          >
            Email
          </label>
          <input
            id="user-email"
            name="email"
            type="email"
            required
            className="h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>

        <div>
          <label
            htmlFor="user-password"
            className="mb-1.5 block text-xs font-semibold text-ink/70"
          >
            Password
          </label>
          <input
            id="user-password"
            name="password"
            type="password"
            required
            minLength={6}
            className="h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          />
        </div>

        <div>
          <label
            htmlFor="user-role"
            className="mb-1.5 block text-xs font-semibold text-ink/70"
          >
            Role
          </label>
          <select
            id="user-role"
            name="role"
            required
            defaultValue="OPERATOR"
            className="h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
          >
            <option value="OPERATOR">Operator</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
          <p className="mt-1.5 text-[11px] leading-tight text-ink/40">
            Operators see only their assigned leads. Admins see all leads and can assign them. Super Admins can also manage the team.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="h-10 w-full rounded-lg bg-brand text-sm font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
