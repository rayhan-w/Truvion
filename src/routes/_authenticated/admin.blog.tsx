import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudPage from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/blog")({ component: BlogPage });

function BlogPage() {
  return (
    <AdminLayout title="Blog Posts">
      <CrudPage
        table="blog_posts"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug (unique)", required: true },
          { name: "category", label: "Category" },
          { name: "status", label: "Status (draft/published)" },
          { name: "content", label: "Content (markdown)", type: "textarea", required: true },
        ]}
        columns={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Slug" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status", render: r => <Badge variant="outline" className="border-primary/30 text-primary">{r.status}</Badge> },
        ]}
      />
    </AdminLayout>
  );
}