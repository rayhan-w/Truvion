import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert } from "@/lib/api.functions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsPage });

const FIELDS = [
  ["name", "Agency Name"], ["email", "Email"], ["phone", "Phone"],
  ["whatsapp", "WhatsApp Number"], ["address", "Address"],
  ["facebook", "Facebook URL"], ["linkedin", "LinkedIn URL"], ["instagram", "Instagram URL"],
] as const;

function SettingsPage() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const qc = useQueryClient();
  const [pw, setPw] = useState("");
  const { data } = useQuery({
    queryKey: ["settings"], queryFn: async () => (await list({ data: { table: "agency_settings" } }))[0] ?? {},
  });

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: any = { id: 1 };
    FIELDS.forEach(([k]) => { row[k] = String(fd.get(k) ?? ""); });
    await upsert({ data: { table: "agency_settings", row } });
    qc.invalidateQueries({ queryKey: ["settings"] });
    qc.invalidateQueries({ queryKey: ["public-agency-info"] });
    toast.success("Settings saved");
  }

  async function changePassword() {
    if (pw.length < 6) return toast.error("Password too short");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    setPw(""); toast.success("Password updated");
  }

  return (
    <AdminLayout title="Settings">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border">
          <h2 className="font-semibold mb-4">Agency Info</h2>
          <form onSubmit={saveSettings} className="grid gap-4">
            {FIELDS.map(([k, label]) => (
              <div key={k}>
                <Label className="mb-2 block">{label}</Label>
                <Input name={k} defaultValue={(data as any)?.[k] ?? ""} />
              </div>
            ))}
            <Button type="submit">Save Changes</Button>
          </form>
        </Card>
        <Card className="p-6 bg-card border-border h-fit">
          <h2 className="font-semibold mb-4">Change Password</h2>
          <div className="grid gap-4">
            <div>
              <Label className="mb-2 block">New Password</Label>
              <Input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="min 6 characters" />
            </div>
            <Button onClick={changePassword}>Update Password</Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}