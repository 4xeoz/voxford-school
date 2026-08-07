"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/actions/auth";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  OPERATOR: "Operator",
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-amber-400/15 text-amber-400",
  ADMIN: "bg-sky-400/15 text-sky-400",
  OPERATOR: "bg-emerald-400/15 text-emerald-400",
};

export default function AdminShell({
  children,
  role,
  name,
  email,
}: {
  children: React.ReactNode;
  role: string | null;
  name: string | null;
  email: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login page — no shell
  if (pathname === "/admin/login") return <>{children}</>;

  const navItems = [
    {
      label: "Leads",
      href: "/admin/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      label: "Blog",
      href: "/admin/blog",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
    ...(role === "SUPER_ADMIN" || role === "ADMIN"
      ? [
          {
            label: "Events",
            href: "/admin/events",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5m-9-6h.008v.008H12V9zm0 3.75h.008v.008H12v-.008zm0 3.75h.008v.008H12V16.5z" />
              </svg>
            ),
          },
        ]
      : []),
    ...(role === "SUPER_ADMIN" || role === "ADMIN"
      ? [
          {
            label: "Team",
            href: "/admin/admins",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            ),
          },
        ]
      : []),
    ...(role === "SUPER_ADMIN" || role === "ADMIN"
      ? [
          {
            label: "Clock Records",
            href: "/admin/clock-records",
            icon: (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  function SidebarContent() {
    return (
      <div className="flex h-full flex-col">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-white">
            N
          </div>
          <span className="text-base font-semibold text-white">Nopeca</span>
        </div>

        {/* Nav */}
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
              {name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{name}</p>
              <p className="truncate text-xs text-white/50">{email}</p>
            </div>
          </div>
          {role && (
            <span className={`mb-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_COLORS[role] || "bg-white/10 text-white/60"}`}>
              {ROLE_LABELS[role] || role}
            </span>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-[#f5f3ee]">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 bg-[#0a1628] lg:block">
        <div className="sticky top-0 h-dvh">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-50 h-full w-60 bg-[#0a1628]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-[#e5e0d5] bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0a1628] transition hover:bg-[#0a1628]/5"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#0a1628]">Nopeca</span>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
