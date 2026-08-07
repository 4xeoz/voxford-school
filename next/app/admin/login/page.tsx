"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Image from "next/image";
import logoMark from "@/public/singl_logo_colord_white_background@4x.png";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await loginAction(formData);
    },
    undefined
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f5f0e8] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src={logoMark}
            alt="Nopeca"
            width={120}
            height={120}
            className="mb-4 h-16 w-auto"
          />
          <h1 className="text-2xl font-bold text-[#0a1628]">Admin Login</h1>
          <p className="mt-1 text-sm text-[#0a1628]/60">
            Sign in to the Nopeca dashboard
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
              className="mb-1 block text-sm font-medium text-[#0a1628]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-[#d1c7b1] bg-white px-4 text-[#0a1628] outline-none focus:border-[#012340] focus:ring-2 focus:ring-[#012340]/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-[#0a1628]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border border-[#d1c7b1] bg-white px-4 text-[#0a1628] outline-none focus:border-[#012340] focus:ring-2 focus:ring-[#012340]/20"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 h-12 w-full rounded-full bg-[#012340] font-semibold text-white transition hover:bg-[#012340]/90 disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
