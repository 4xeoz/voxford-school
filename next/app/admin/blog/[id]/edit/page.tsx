import { notFound } from "next/navigation";
import { getPostById } from "@/actions/blog";
import BlogForm from "../../blog-form";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a1628]">Edit Blog Post</h1>
        <p className="mt-1 text-sm text-[#0a1628]/60">
          Update your post content and SEO settings
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
