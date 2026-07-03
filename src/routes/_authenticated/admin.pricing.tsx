import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete } from "@/lib/api.functions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/pricing")({ component: PricingAdmin });

type Pkg = {
  id?: string;
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
  cta_label: string | null;
  sort_order: number;
  enabled: boolean;
};

function PricingAdmin() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Pkg> | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: ["pricing_packages"],
    queryFn: () => list({ data: { table: "pricing_packages" } }),
  });
  const rows = data as Pkg[];

  function openNew() {
    setEditing({ name: "", price: "", features: [], is_popular: false, cta_label: "", sort_order: (rows.length + 1) * 10, enabled: true });
    setOpen(true);
  }
  function openEdit(r: Pkg) { setEditing({ ...r }); setOpen(true); }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const featuresRaw = String(fd.get("features") || "");
    const row: any = {
      ...(editing?.id ? { id: editing.id } : {}),
      name: String(fd.get("name") || "").trim(),
      price: String(fd.get("price") || "").trim(),
      features: featuresRaw.split("\n").map(s => s.trim()).filter(Boolean),
      is_popular: fd.get("is_popular") === "on",
      cta_label: String(fd.get("cta_label") || "").trim() || null,
      sort_order: Number(fd.get("sort_order") || 0),
      enabled: fd.get("enabled") === "on",
    };
    try {
      await upsert({ data: { table: "pricing_packages", row } });
      qc.invalidateQueries({ queryKey: ["pricing_packages"] });
      qc.invalidateQueries({ queryKey: ["public-agency-info"] });
      toast.success("Saved");
      setOpen(false);
    } catch (e: any) { toast.error(e?.message || "Save failed"); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await del({ data: { table: "pricing_packages", id } });
    qc.invalidateQueries({ queryKey: ["pricing_packages"] });
    qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    toast.success("Deleted");
  }

  return (
    <AdminLayout title="Pricing Packages">
      <p className="text-sm text-muted-foreground mb-4">
        Fully editable pricing packages. Changes appear on the public site after refresh.
      </p>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New Package</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit Package" : "New Package"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="grid gap-4">
              <div>
                <Label className="mb-2 block">Name</Label>
                <Input name="name" defaultValue={editing?.name ?? ""} required />
              </div>
              <div>
                <Label className="mb-2 block">Price (e.g. ৳46,000)</Label>
                <Input name="price" defaultValue={editing?.price ?? ""} required />
              </div>
              <div>
                <Label className="mb-2 block">Features (one per line)</Label>
                <Textarea name="features" rows={7} defaultValue={(editing?.features ?? []).join("\n")} placeholder={"5-page custom website\nMobile responsive\nBasic SEO setup"} />
              </div>
              <div>
                <Label className="mb-2 block">CTA Button Label (optional)</Label>
                <Input name="cta_label" defaultValue={editing?.cta_label ?? ""} placeholder="Choose Starter" />
              </div>
              <div>
                <Label className="mb-2 block">Sort Order</Label>
                <Input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} />
              </div>
              <div className="flex items-center gap-3">
                <Switch name="is_popular" defaultChecked={editing?.is_popular ?? false} />
                <Label>Mark as "Most Popular"</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch name="enabled" defaultChecked={editing?.enabled ?? true} />
                <Label>Enabled (visible publicly)</Label>
              </div>
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">No packages.</TableCell></TableRow>}
            {rows.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.price}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.features?.length ?? 0} features</TableCell>
                <TableCell>{r.is_popular ? "Yes" : "No"}</TableCell>
                <TableCell>{r.enabled ? "Yes" : "No"}</TableCell>
                <TableCell>{r.sort_order}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => r.id && remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
}