import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EventForm from "../event-form";

export default async function NewEventPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role: string }).role;
  if (role === "OPERATOR") redirect("/admin/dashboard");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/events"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0a1628]/50 transition-colors hover:bg-[#0a1628]/8 hover:text-[#0a1628]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-[#0a1628]">Create Event</h1>
          <p className="text-sm text-[#0a1628]/50">
            A unique registration link and QR code will be generated automatically.
          </p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-[#e5e0d5] bg-white p-6">
        <EventForm />
      </div>
    </div>
  );
}
