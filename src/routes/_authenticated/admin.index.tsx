import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminDashboardStats } from "@/lib/api.functions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, FolderKanban, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const fn = useServerFn(adminDashboardStats);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dash"], queryFn: () => fn({ data: undefined as any }),
  });
  const stats = [
    { label: "Leads This Month", value: data?.leadsThisMonth ?? "—", icon: Inbox },
    { label: "Active Projects", value: data?.activeProjects ?? "—", icon: FolderKanban },
    { label: "Total Clients", value: data?.totalClients ?? "—", icon: Users },
    { label: "Monthly Revenue", value: data ? `৳${Number(data.monthlyRevenue).toLocaleString()}` : "—", icon: DollarSign },
  ];
  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <Card key={s.label} className="p-5 bg-card border-border">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-3xl font-bold font-display mt-2 text-gradient-gold">{s.value}</div>
          </Card>
        ))}
      </div>
      <Card className="bg-card border-border">
        <div className="px-5 py-4 border-b border-border font-semibold">Recent Leads</div>
        <div className="divide-y divide-border">
          {isLoading && <div className="p-5 text-sm text-muted-foreground">Loading…</div>}
          {!isLoading && (data?.recentLeads.length ?? 0) === 0 && (
            <div className="p-5 text-sm text-muted-foreground">No leads yet.</div>
          )}
          {data?.recentLeads.map((l: any) => (
            <div key={l.id} className="p-4 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{l.name} <span className="text-muted-foreground">· {l.email}</span></div>
                <div className="text-xs text-muted-foreground">{l.service_interested || "—"} · {new Date(l.created_at).toLocaleString()}</div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">{l.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </AdminLayout>
  );
}