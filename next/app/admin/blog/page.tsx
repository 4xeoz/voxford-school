import Link from "next/link";
import { getAdminPosts } from "@/actions/blog";
import BlogActions from "./blog-actions";

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Blog Posts</h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage your blog content across all languages
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-hairline bg-white p-12 text-center">
          <p className="text-sm text-ink/50">
            No blog posts yet. Create your first post to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-white">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-hairline bg-surface-soft">
              <tr>
                <th className="px-4 py-3 font-medium text-ink/70">
                  Title
                </th>
                <th className="hidden px-4 py-3 font-medium text-ink/70 sm:table-cell">
                  Author
                </th>
                <th className="hidden px-4 py-3 font-medium text-ink/70 md:table-cell">
                  Languages
                </th>
                <th className="px-4 py-3 font-medium text-ink/70">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-ink/70">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {posts.map((post) => {
                const langs = [
                  "EN",
                  ...(post.titleFr ? ["FR"] : []),
                  ...(post.titleAr ? ["AR"] : []),
                ];
                return (
                  <tr key={post.id} className="hover:bg-surface-soft/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">
                        {post.titleEn}
                      </div>
                      <div className="mt-0.5 text-xs text-ink/40">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-ink/60 sm:table-cell">
                      {post.author.name}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex gap-1">
                        {langs.map((l) => (
                          <span
                            key={l}
                            className="rounded bg-brand/10 px-1.5 py-0.5 text-xs font-medium text-brand"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          post.published
                            ? "bg-emerald-400/15 text-emerald-600"
                            : "bg-amber-400/15 text-amber-600"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <BlogActions postId={post.id} published={post.published} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
