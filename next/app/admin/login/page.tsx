"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Image from "next/image";
import logoMark from "@/public/voxbridge/icon-detailed-red-transparent-v2.png";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await loginAction(formData);
    },
    undefined
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-soft px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src={logoMark}
            alt="Voxbridge"
            width={120}
            height={120}
            className="mb-4 h-16 w-auto"
          />
          <h1 className="text-2xl font-bold text-ink">Admin Login</h1>
          <p className="mt-1 text-sm text-ink/60">
            Sign in to the Voxbridge dashboard
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          {state?.error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-hairline bg-white px-4 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-hairline bg-white px-4 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 h-12 w-full rounded-full bg-brand font-semibold text-white transition hover:bg-brand/90 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
