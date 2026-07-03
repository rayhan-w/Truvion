import { createFileRoute } from "@tanstack/react-router";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudPage from "@/components/admin/CrudPage";

export const Route = createFileRoute("/_authenticated/admin/services")({ component: ServicesPage });

function ServicesPage() {
  return (
    <AdminLayout title="Services">
      <CrudPage
        table="services"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "icon", label: "Icon (Lucide name: Code, Search, Megaphone, ...)" },
          { name: "price", label: "Price label" },
          { name: "sort_order", label: "Sort Order", type: "number" },
          { name: "enabled", label: "Enabled (visible publicly)", type: "switch" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "icon", label: "Icon" },
          { key: "price", label: "Price" },
          { key: "enabled", label: "Enabled", render: r => r.enabled ? "Yes" : "No" },
          { key: "sort_order", label: "Order" },
        ]}
      />
    </AdminLayout>
  );
}