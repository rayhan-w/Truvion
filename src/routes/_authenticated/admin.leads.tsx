import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert } from "@/lib/api.functions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["new", "contacted", "proposal_sent", "closed_won", "closed_lost"] as const;

export const Route = createFileRoute("/_authenticated/admin/leads")({ component: LeadsPage });

function LeadsPage() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const { data = [], isLoading } = useQuery({
    queryKey: ["leads"], queryFn: () => list({ data: { table: "leads" } }),
  });

  const rows = useMemo(() => (data as any[]).filter(r =>
    (status === "all" || r.status === status) &&
    (search === "" || [r.name, r.email, r.phone, r.business_type].join(" ").toLowerCase().includes(search.toLowerCase()))
  ), [data, search, status]);

  async function updateStatus(id: string, newStatus: string) {
    await upsert({ data: { table: "leads", row: { id, status: newStatus } } });
    qc.invalidateQueries({ queryKey: ["leads"] });
    toast.success("Status updated");
  }

  function exportCsv() {
    const headers = ["Name","Email","Phone","Business","Service","Message","Status","Date"];
    const lines = [headers.join(",")];
    rows.forEach((r: any) => {
      lines.push([r.name, r.email, r.phone, r.business_type, r.service_interested, r.message, r.status, r.created_at]
        .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout title="Leads">
      <Card className="p-4 bg-card border-border mb-4 flex flex-wrap gap-3 items-center">
        <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button onClick={exportCsv} variant="outline"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
      </Card>
      <Card className="bg-card border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead>
              <TableHead>Business</TableHead><TableHead>Service</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No leads found.</TableCell></TableRow>}
            {rows.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>{r.business_type || "—"}</TableCell>
                <TableCell>{r.service_interested || "—"}</TableCell>
                <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select value={r.status} onValueChange={v => updateStatus(r.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
}