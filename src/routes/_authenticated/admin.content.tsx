import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert, adminCreateUploadTicket, adminSignImageUrl } from "@/lib/api.functions";
import { prepareImageUpload } from "@/lib/image-upload";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Save, Plus } from "lucide-react";
import { Upload, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

type Row = {
  id: string;
  section: string;
  key: string;
  label: string | null;
  input_type: string;
  value_text: string | null;
  value_image_url: string | null;
  sort_order: number;
};

function ContentPage() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const createTicket = useServerFn(adminCreateUploadTicket);
  const signUrl = useServerFn(adminSignImageUrl);
  const qc = useQueryClient();
  const [uploading, setUploading] = useState<string | null>(null);

  async function uploadImg(rowId: string, file: File) {
    setUploading(rowId);
    try {
      const { blob, fileName, contentType } = await prepareImageUpload(file);
      const ticket = await createTicket({ data: { table: "site_content" as any, fileName, contentType } });
      const { error: upErr } = await supabase.storage
        .from(ticket.bucket)
        .uploadToSignedUrl(ticket.path, ticket.token, blob, { contentType, upsert: false });
      if (upErr) throw upErr;
      const { url } = await signUrl({ data: { path: ticket.path } });
      setValues(v => ({ ...v, [rowId]: { ...v[rowId], value_image_url: url } }));
      toast.success("Uploaded — click Save to keep it");
    } catch (e: any) { 
      console.error("Content image upload failed:", e);
      toast.error(e?.message || "Upload failed"); 
    }
    finally { setUploading(null); }
  }
  const { data = [], isLoading } = useQuery({
    queryKey: ["site_content"],
    queryFn: () => list({ data: { table: "site_content" as any } }),
  });
  const rows = data as Row[];

  const [values, setValues] = useState<Record<string, Partial<Row>>>({});
  useEffect(() => {
    const v: Record<string, Partial<Row>> = {};
    rows.forEach(r => { v[r.id] = { value_text: r.value_text, value_image_url: r.value_image_url }; });
    setValues(v);
  }, [data]);

  const sections = useMemo(() => {
    const s = new Set<string>(); rows.forEach(r => s.add(r.section));
    return Array.from(s);
  }, [rows]);

  async function saveOne(row: Row) {
    const patch = values[row.id] || {};
    try {
      await upsert({ data: { table: "site_content" as any, row: { ...row, ...patch } } });
      toast.success(`Saved: ${row.label || row.key}`);
      qc.invalidateQueries({ queryKey: ["site_content"] });
      qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    } catch (e: any) { toast.error(e?.message || "Save failed"); }
  }

  async function saveSection(section: string) {
    const affected = rows.filter(r => r.section === section);
    try {
      await Promise.all(affected.map(r => upsert({ data: { table: "site_content" as any, row: { ...r, ...(values[r.id] || {}) } } })));
      toast.success(`Saved section: ${section}`);
      qc.invalidateQueries({ queryKey: ["site_content"] });
      qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    } catch (e: any) { toast.error(e?.message || "Save failed"); }
  }

  async function addNew(section: string) {
    const key = prompt("New content key (letters, numbers, underscore):");
    if (!key) return;
    const label = prompt("Label (shown in admin):") || key;
    const input_type = prompt("Type: text | textarea | image | url", "text") || "text";
    try {
      await upsert({ data: { table: "site_content" as any, row: { section, key, label, input_type, sort_order: 999 } } });
      toast.success("Field added");
      qc.invalidateQueries({ queryKey: ["site_content"] });
      qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    } catch (e: any) { toast.error(e?.message || "Failed"); }
  }

  if (isLoading) return <AdminLayout title="Site Content"><p className="text-muted-foreground">Loading…</p></AdminLayout>;

  return (
    <AdminLayout title="Site Content Editor">
      <p className="text-sm text-muted-foreground mb-4">
        Edit every piece of text and image on your website. Changes appear instantly after saving and refreshing the page.
      </p>
      <Tabs defaultValue={sections[0]}>
        <TabsList className="flex-wrap h-auto">
          {sections.map(s => <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>)}
        </TabsList>
        {sections.map(section => (
          <TabsContent key={section} value={section} className="mt-4">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold capitalize">{section} Section</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => addNew(section)}><Plus className="h-4 w-4 mr-1" /> Add Field</Button>
                  <Button size="sm" onClick={() => saveSection(section)}><Save className="h-4 w-4 mr-1" /> Save All</Button>
                </div>
              </div>
              <div className="space-y-5">
                {rows.filter(r => r.section === section).map(r => (
                  <div key={r.id} className="grid gap-2">
                    <Label className="text-sm font-medium">
                      {r.label || r.key} <span className="text-xs text-muted-foreground">({r.key})</span>
                    </Label>
                    {r.input_type === "image" ? (
                      <div className="space-y-2">
                        <div className="flex gap-2 items-start">
                          <Input
                            placeholder="Image URL (https://…) or upload →"
                            value={values[r.id]?.value_image_url ?? ""}
                            onChange={e => setValues(v => ({ ...v, [r.id]: { ...v[r.id], value_image_url: e.target.value } }))}
                          />
                          <label className="inline-flex items-center gap-1 h-10 px-3 rounded-md border border-border bg-background cursor-pointer hover:bg-accent text-sm whitespace-nowrap">
                            {uploading === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            Upload
                            <input type="file" accept="image/*" className="hidden" disabled={uploading === r.id}
                              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImg(r.id, f); e.target.value = ""; }} />
                          </label>
                        </div>
                        {values[r.id]?.value_image_url && (
                          <img src={values[r.id]?.value_image_url ?? ""} alt="" className="h-16 w-16 object-cover rounded border border-border" />
                        )}
                      </div>
                    ) : r.input_type === "textarea" ? (
                      <Textarea
                        rows={3}
                        value={values[r.id]?.value_text ?? ""}
                        onChange={e => setValues(v => ({ ...v, [r.id]: { ...v[r.id], value_text: e.target.value } }))}
                      />
                    ) : (
                      <Input
                        value={values[r.id]?.value_text ?? ""}
                        onChange={e => setValues(v => ({ ...v, [r.id]: { ...v[r.id], value_text: e.target.value } }))}
                      />
                    )}
                    <div className="flex justify-end">
                      <Button size="sm" variant="ghost" onClick={() => saveOne(r)}>Save</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </AdminLayout>
  );
}
