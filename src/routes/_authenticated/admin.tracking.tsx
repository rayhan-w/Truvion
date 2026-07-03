import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminList, adminUpsert } from "@/lib/api.functions";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated/admin/tracking")({ component: TrackingPage });

const GROUPS: { title: string; fields: [string, string, string?][] }[] = [
  {
    title: "Google",
    fields: [
      ["ga4_id", "GA4 Measurement ID", "G-XXXXXXX"],
      ["gtm_id", "Google Tag Manager ID", "GTM-XXXXXX"],
      ["google_search_console", "Search Console verification", "content value only"],
      ["google_site_verification", "Google site verification", "content value only"],
      ["google_ads_conversion_id", "Google Ads Conversion ID", "AW-XXXXXXXXX"],
      ["google_ads_label", "Google Ads Label"],
    ],
  },
  {
    title: "Meta / Facebook",
    fields: [
      ["meta_pixel_id", "Meta Pixel ID"],
      ["meta_capi_token", "Meta Conversions API Access Token (kept private)"],
      ["meta_test_event_code", "Meta Test Event Code (for testing)"],
      ["meta_domain_verification", "Meta Domain Verification"],
    ],
  },
  {
    title: "Other Pixels",
    fields: [
      ["tiktok_pixel_id", "TikTok Pixel ID"],
      ["linkedin_partner_id", "LinkedIn Insight Partner ID"],
      ["snapchat_pixel_id", "Snapchat Pixel ID"],
      ["pinterest_tag_id", "Pinterest Tag ID"],
      ["twitter_pixel_id", "Twitter (X) Pixel ID"],
    ],
  },
  {
    title: "Heatmaps",
    fields: [
      ["clarity_id", "Microsoft Clarity Project ID"],
      ["hotjar_id", "Hotjar Site ID"],
    ],
  },
];

const LONG_FIELDS: [string, string, string][] = [
  ["custom_head_scripts", "Custom <head> scripts", "Raw HTML injected into <head>"],
  ["custom_body_scripts", "Custom <body> scripts", "Raw HTML injected before </body>"],
  ["custom_css", "Custom CSS", "Applied site-wide"],
  ["custom_js", "Custom JavaScript", "Applied site-wide"],
  ["schema_markup", "Schema.org JSON-LD", "Full <script type=application/ld+json>{...}</script>"],
];

function TrackingPage() {
  const list = useServerFn(adminList);
  const upsert = useServerFn(adminUpsert);
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["tracking_settings"],
    queryFn: async () => (await list({ data: { table: "tracking_settings" } }))[0] ?? { id: 1, enabled: true },
  });
  const [enabled, setEnabled] = useState<boolean>(true);
  useEffect(() => { if (data) setEnabled(!!(data as any).enabled); }, [data]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const row: any = { id: 1, enabled };
    for (const g of GROUPS) for (const [k] of g.fields) row[k] = String(fd.get(k) ?? "").trim() || null;
    for (const [k] of LONG_FIELDS) row[k] = String(fd.get(k) ?? "").trim() || null;
    try {
      await upsert({ data: { table: "tracking_settings", row } });
      qc.invalidateQueries({ queryKey: ["tracking_settings"] });
      qc.invalidateQueries({ queryKey: ["public_tracking"] });
      toast.success("Tracking settings saved");
    } catch (err: any) { toast.error(err?.message || "Save failed"); }
  }

  const d: any = data ?? {};
  return (
    <AdminLayout title="Tracking & Analytics">
      <form onSubmit={save} className="grid gap-6 max-w-5xl">
        <Card className="p-5 flex items-center justify-between bg-card border-border">
          <div>
            <div className="font-semibold">Tracking enabled</div>
            <div className="text-sm text-muted-foreground">Master switch — turn off to disable all client & server-side tracking.</div>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </Card>

        {GROUPS.map(g => (
          <Card key={g.title} className="p-6 bg-card border-border">
            <h2 className="font-semibold mb-4">{g.title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {g.fields.map(([k, label, ph]) => (
                <div key={k}>
                  <Label className="mb-2 block text-sm">{label}</Label>
                  <Input name={k} defaultValue={d[k] ?? ""} placeholder={ph} autoComplete="off" />
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-6 bg-card border-border">
          <h2 className="font-semibold mb-4">Custom Code</h2>
          <div className="grid gap-4">
            {LONG_FIELDS.map(([k, label, ph]) => (
              <div key={k}>
                <Label className="mb-2 block text-sm">{label}</Label>
                <Textarea name={k} defaultValue={d[k] ?? ""} placeholder={ph} rows={5} className="font-mono text-xs" />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg">Save Tracking Settings</Button>
        </div>
      </form>
    </AdminLayout>
  );
}