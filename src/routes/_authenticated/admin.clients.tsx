import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudPage from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/clients")({ component: ClientsPage });

function ClientsPage() {
  return (
    <AdminLayout title="Clients">
      <CrudPage
        table="clients"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "business", label: "Business" },
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone" },
          { name: "join_date", label: "Join Date", type: "date" },
          { name: "total_paid", label: "Total Paid (৳)", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "business", label: "Business" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "total_paid", label: "Total Paid", render: r => `৳${Number(r.total_paid || 0).toLocaleString()}` },
        ]}
      />
    </AdminLayout>
  );
}