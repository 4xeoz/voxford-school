"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost, togglePublish } from "@/actions/blog";
import { toast } from "sonner";

export default function BlogActions({
  postId,
  published,
}: {
  postId: string;
  published: boolean;
}) {
  const router = useRouter();

  async function handleToggle() {
    const result = await togglePublish(postId);
    if ("error" in result && result.error) {
      toast.error(result.error as string);
      return;
    }
    toast.success(published ? "Unpublished" : "Published");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const result = await deletePost(postId);
    if ("error" in result && result.error) {
      toast.error(result.error as string);
      return;
    }
    toast.success("Post deleted");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/blog/${postId}/edit`}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#012340] transition hover:bg-[#012340]/10"
      >
        Edit
      </Link>
      <button
        type="button"
        onClick={handleToggle}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#012340]/60 transition hover:bg-[#012340]/10"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
      >
        Delete
      </button>
    </div>
  );
}
