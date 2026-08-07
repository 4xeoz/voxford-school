import BlogForm from "../blog-form";

export default function NewBlogPostPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a1628]">New Blog Post</h1>
        <p className="mt-1 text-sm text-[#0a1628]/60">
          Write your post in multiple languages for better SEO reach
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        <BlogForm />
      </div>
    </div>
  );
}
