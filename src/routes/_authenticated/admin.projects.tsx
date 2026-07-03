import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudPage from "@/components/admin/CrudPage";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/projects")({ component: ProjectsPage });

function ProjectsPage() {
  return (
    <AdminLayout title="Projects">
      <CrudPage
        table="projects"
        fields={[
          { name: "client_name", label: "Client Name", required: true },
          { name: "project_type", label: "Project Type", required: true },
          { name: "start_date", label: "Start Date", type: "date" },
          { name: "deadline", label: "Deadline", type: "date" },
          { name: "status", label: "Status (planning/in_progress/review/completed)" },
          { name: "budget", label: "Budget (৳)", type: "number" },
        ]}
        columns={[
          { key: "client_name", label: "Client" },
          { key: "project_type", label: "Type" },
          { key: "deadline", label: "Deadline" },
          { key: "status", label: "Status", render: r => <Badge variant="outline" className="border-primary/30 text-primary">{r.status}</Badge> },
          { key: "budget", label: "Budget", render: r => `৳${Number(r.budget || 0).toLocaleString()}` },
        ]}
      />
    </AdminLayout>
  );
}