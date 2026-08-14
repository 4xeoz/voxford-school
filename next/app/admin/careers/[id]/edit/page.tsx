import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getJobById } from "@/actions/careers";
import JobForm from "../../job-form";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const role = (session.user as { role?: string }).role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") redirect("/admin/dashboard");

  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/admin/careers/${id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-ink/10 hover:text-ink"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">Edit Job</h1>
          <p className="text-sm text-ink/50">{job.title}</p>
        </div>
      </div>

      <div className="max-w-2xl rounded-xl border border-hairline bg-white p-6">
        <JobForm job={JSON.parse(JSON.stringify(job))} />
      </div>
    </div>
  );
}
