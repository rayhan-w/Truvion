import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudPage from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: TeamPage,
});

function TeamPage() {
  return (
    <AdminLayout title="Team Members">
      <CrudPage
        table={"team_members" as any}
        fields={[
          { name: "name", label: "Full Name", required: true },
          { name: "role", label: "Role / Position", required: true },
          { name: "bio", label: "Short Bio", type: "textarea" },
          { name: "photo_url", label: "Photo", type: "image" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone" },
          { name: "facebook_url", label: "Facebook URL" },
          { name: "linkedin_url", label: "LinkedIn URL" },
          { name: "twitter_url", label: "Twitter / X URL" },
          { name: "instagram_url", label: "Instagram URL" },
          { name: "github_url", label: "GitHub URL" },
          { name: "website_url", label: "Website URL" },
          { name: "sort_order", label: "Sort Order", type: "number" },
          { name: "enabled", label: "Visible on site", type: "switch" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "enabled", label: "Visible", render: (r) => (r.enabled ? "Yes" : "No") },
          { key: "sort_order", label: "Order" },
        ]}
      />
    </AdminLayout>
  );
}
