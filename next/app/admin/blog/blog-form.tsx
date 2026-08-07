"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/actions/blog";
import { toast } from "sonner";

type PostData = {
  id?: string;
  published?: boolean;
  titleEn?: string;
  excerptEn?: string;
  contentEn?: string;
  metaTitleEn?: string | null;
  metaDescEn?: string | null;
  keywordsEn?: string | null;
  titleFr?: string | null;
  excerptFr?: string | null;
  contentFr?: string | null;
  metaTitleFr?: string | null;
  metaDescFr?: string | null;
  keywordsFr?: string | null;
  titleAr?: string | null;
  excerptAr?: string | null;
  contentAr?: string | null;
  metaTitleAr?: string | null;
  metaDescAr?: string | null;
  keywordsAr?: string | null;
  coverImage?: string | null;
};

const TABS = [
  { key: "en", label: "English" },
  { key: "fr", label: "French" },
  { key: "ar", label: "Arabic" },
] as const;

export default function BlogForm({ post }: { post?: PostData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"en" | "fr" | "ar">("en");
  const isEdit = !!post?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const result = isEdit
      ? await updatePost(post!.id!, formData)
      : await createPost(formData);

    setSaving(false);

    if ("error" in result) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Post updated!" : "Post created!");
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Published toggle + Cover image */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-xl border border-[#e5e0d5] bg-white px-4 py-3">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={post?.published ?? false}
            className="h-4 w-4 rounded border-gray-300 text-[#012340] focus:ring-[#012340]"
          />
          <span className="text-sm font-medium text-[#0a1628]">
            Published
          </span>
        </label>
        <div>
          <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
            Cover Image URL
          </label>
          <input
            name="coverImage"
            defaultValue={post?.coverImage ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-[#e5e0d5] bg-white px-4 py-2.5 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-1 focus:ring-[#012340]"
          />
        </div>
      </div>

      {/* Language tabs */}
      <div className="flex gap-1 rounded-xl bg-[#e5e0d5]/50 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "bg-white text-[#0a1628] shadow-sm"
                : "text-[#0a1628]/50 hover:text-[#0a1628]/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {TABS.map((t) => (
        <div
          key={t.key}
          className={tab === t.key ? "space-y-4" : "hidden"}
          dir={t.key === "ar" ? "rtl" : "ltr"}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
              Title {t.key !== "en" && "(optional)"}
            </label>
            <input
              name={`title${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
              defaultValue={
                (post as Record<string, unknown>)?.[
                  `title${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                ] as string ?? ""
              }
              required={t.key === "en"}
              placeholder={`Post title in ${t.label}`}
              className="w-full rounded-xl border border-[#e5e0d5] bg-white px-4 py-2.5 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-1 focus:ring-[#012340]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
              Excerpt {t.key !== "en" && "(optional)"}
            </label>
            <textarea
              name={`excerpt${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
              defaultValue={
                (post as Record<string, unknown>)?.[
                  `excerpt${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                ] as string ?? ""
              }
              required={t.key === "en"}
              rows={2}
              placeholder={`Short excerpt in ${t.label}`}
              className="w-full rounded-xl border border-[#e5e0d5] bg-white px-4 py-2.5 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-1 focus:ring-[#012340]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
              Content {t.key !== "en" && "(optional)"}
            </label>
            <textarea
              name={`content${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
              defaultValue={
                (post as Record<string, unknown>)?.[
                  `content${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                ] as string ?? ""
              }
              required={t.key === "en"}
              rows={12}
              placeholder={`Full post content in ${t.label} (supports Markdown)`}
              className="w-full rounded-xl border border-[#e5e0d5] bg-white px-4 py-2.5 text-sm text-[#0a1628] outline-none transition focus:border-[#012340] focus:ring-1 focus:ring-[#012340] font-mono"
            />
          </div>

          {/* SEO fields */}
          <details className="rounded-xl border border-[#e5e0d5] bg-white">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[#0a1628]">
              SEO Settings ({t.label})
            </summary>
            <div className="space-y-3 border-t border-[#e5e0d5] p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
                  Meta Title
                </label>
                <input
                  name={`metaTitle${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
                  defaultValue={
                    (post as Record<string, unknown>)?.[
                      `metaTitle${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                    ] as string ?? ""
                  }
                  placeholder="Custom SEO title (defaults to post title)"
                  className="w-full rounded-lg border border-[#e5e0d5] px-3 py-2 text-sm outline-none focus:border-[#012340]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
                  Meta Description
                </label>
                <textarea
                  name={`metaDesc${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
                  defaultValue={
                    (post as Record<string, unknown>)?.[
                      `metaDesc${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                    ] as string ?? ""
                  }
                  rows={2}
                  placeholder="Custom SEO description (defaults to excerpt)"
                  className="w-full rounded-lg border border-[#e5e0d5] px-3 py-2 text-sm outline-none focus:border-[#012340]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#0a1628]/60">
                  Keywords (comma-separated)
                </label>
                <input
                  name={`keywords${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`}
                  defaultValue={
                    (post as Record<string, unknown>)?.[
                      `keywords${t.key.charAt(0).toUpperCase() + t.key.slice(1)}`
                    ] as string ?? ""
                  }
                  placeholder={
                    t.key === "en"
                      ? "study abroad, UK university, Algeria"
                      : t.key === "fr"
                        ? "étudier à l'étranger, université UK, Algérie"
                        : "الدراسة في الخارج، جامعة بريطانيا، الجزائر"
                  }
                  className="w-full rounded-lg border border-[#e5e0d5] px-3 py-2 text-sm outline-none focus:border-[#012340]"
                />
              </div>
            </div>
          </details>
        </div>
      ))}

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#012340] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#012340]/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="rounded-xl border border-[#e5e0d5] px-6 py-2.5 text-sm font-medium text-[#0a1628] transition hover:bg-[#e5e0d5]/50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
