import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminDelete, adminCreateUploadTicket, adminSignImageUrl } from "@/lib/api.functions";
import { prepareImageUpload } from "@/lib/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "date" | "switch" | "email" | "image";
  required?: boolean;
};

export default function CrudPage({
  table, fields, columns,
}: {
  table: "projects" | "clients" | "services" | "blog_posts";
  fields: CrudField[];
  columns: { key: string; label: string; render?: (r: any) => any }[];
}) {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const del = useServerFn(adminDelete);
  const createTicket = useServerFn(adminCreateUploadTicket);
  const signUrl = useServerFn(adminSignImageUrl);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [imgVals, setImgVals] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: [table], queryFn: () => list({ data: { table } }),
  });

  function openNew() { setEditing({}); setImgVals({}); setOpen(true); }
  function openEdit(row: any) {
    setEditing(row);
    const iv: Record<string, string> = {};
    fields.filter(f => f.type === "image").forEach(f => { iv[f.name] = row?.[f.name] ?? ""; });
    setImgVals(iv);
    setOpen(true);
  }

  async function uploadFile(fieldName: string, file: File) {
    setUploading(fieldName);
    try {
      const { blob, fileName, contentType } = await prepareImageUpload(file);
      const ticket = await createTicket({ data: { table, fileName, contentType } });
      const { error: upErr } = await supabase.storage
        .from(ticket.bucket)
        .uploadToSignedUrl(ticket.path, ticket.token, blob, { contentType, upsert: false });
      if (upErr) throw upErr;
      const { url } = await signUrl({ data: { path: ticket.path } });
      setImgVals(v => ({ ...v, [fieldName]: url }));
      toast.success("Uploaded — click Save to keep it");
    } catch (e: any) { 
      console.error("Image upload failed:", e);
      toast.error(e?.message || "Upload failed"); 
    }
    finally { setUploading(null); }
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: any = { ...(editing?.id ? { id: editing.id } : {}) };
    for (const f of fields) {
      let v: any = fd.get(f.name);
      if (f.type === "switch") v = fd.get(f.name) === "on";
      if (f.type === "number") v = v === "" || v == null ? 0 : Number(v);
      if (f.type === "image") v = imgVals[f.name] ?? "";
      if (v === "") v = null;
      row[f.name] = v;
    }
    try {
      await upsert({ data: { table, row } });
      qc.invalidateQueries({ queryKey: [table] });
      qc.invalidateQueries({ queryKey: ["public-agency-info"] });
      toast.success("Saved");
      setOpen(false);
    } catch (e: any) { toast.error(e?.message || "Save failed"); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await del({ data: { table, id } });
    qc.invalidateQueries({ queryKey: [table] });
    qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    toast.success("Deleted");
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew}><Plus className="h-4 w-4 mr-1" /> New</Button></DialogTrigger>
          <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="grid gap-4">
              {fields.map(f => (
                <div key={f.name}>
                  <Label className="mb-2 block">{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea name={f.name} defaultValue={editing?.[f.name] ?? ""} rows={4} required={f.required} />
                  ) : f.type === "switch" ? (
                    <Switch name={f.name} defaultChecked={editing?.[f.name] ?? true} />
                  ) : f.type === "image" ? (
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <Input
                          value={imgVals[f.name] ?? ""}
                          onChange={e => setImgVals(v => ({ ...v, [f.name]: e.target.value }))}
                          placeholder="Paste image URL or upload →"
                        />
                        <label className="inline-flex items-center gap-1 h-10 px-3 rounded-md border border-border bg-background cursor-pointer hover:bg-accent text-sm whitespace-nowrap">
                          {uploading === f.name ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          Upload
                          <input type="file" accept="image/*" className="hidden" disabled={uploading === f.name}
                            onChange={e => { const file = e.target.files?.[0]; if (file) uploadFile(f.name, file); e.target.value = ""; }} />
                        </label>
                      </div>
                      {imgVals[f.name] && <img src={imgVals[f.name]} alt="" className="h-20 w-20 object-cover rounded border border-border" />}
                    </div>
                  ) : (
                    <Input name={f.name} type={f.type ?? "text"} defaultValue={editing?.[f.name] ?? ""} required={f.required} />
                  )}
                </div>
              ))}
              <DialogFooter><Button type="submit">Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="bg-card border-border overflow-x-auto">
        <Table>
          <TableHeader><TableRow>{columns.map(c => <TableHead key={c.key}>{c.label}</TableHead>)}<TableHead className="w-24"></TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">Loading…</TableCell></TableRow>}
            {!isLoading && (data as any[]).length === 0 && <TableRow><TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">No records.</TableCell></TableRow>}
            {(data as any[]).map(r => (
              <TableRow key={r.id}>
                {columns.map(c => <TableCell key={c.key}>{c.render ? c.render(r) : (r[c.key] ?? "—")}</TableCell>)}
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}