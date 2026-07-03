import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ------- PUBLIC -------
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  phone: z.string().min(5).max(40),
  business_type: z.string().max(80).optional().default(""),
  service_interested: z.string().max(80).optional().default(""),
  message: z.string().max(2000).optional().default(""),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      business_type: data.business_type || null,
      service_interested: data.service_interested || null,
      message: data.message || null,
    });
    if (error) throw new Error(error.message);

    // Server-side Meta Conversions API — fire Lead event
    try {
      const { data: t } = await supabaseAdmin
        .from("tracking_settings")
        .select("meta_pixel_id, meta_capi_token, meta_test_event_code, enabled")
        .eq("id", 1)
        .maybeSingle();
      if (t?.enabled && t.meta_pixel_id && t.meta_capi_token) {
        const req = getRequest();
        const ua = req?.headers.get("user-agent") ?? "";
        const xff = req?.headers.get("x-forwarded-for") ?? "";
        const ip = xff.split(",")[0]?.trim() || "";
        const referer = req?.headers.get("referer") ?? "";
        const sha256 = async (v: string) => {
          const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v.trim().toLowerCase()));
          return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
        };
        const [em, ph, fn] = await Promise.all([
          sha256(data.email),
          sha256(data.phone.replace(/\D/g, "")),
          sha256(data.name),
        ]);
        const body: any = {
          data: [{
            event_name: "Lead",
            event_time: Math.floor(Date.now() / 1000),
            action_source: "website",
            event_source_url: referer || undefined,
            user_data: {
              em: [em], ph: [ph], fn: [fn],
              client_ip_address: ip || undefined,
              client_user_agent: ua || undefined,
            },
            custom_data: {
              service: data.service_interested || undefined,
              business_type: data.business_type || undefined,
            },
          }],
        };
        if (t.meta_test_event_code) body.test_event_code = t.meta_test_event_code;
        await fetch(`https://graph.facebook.com/v21.0/${t.meta_pixel_id}/events?access_token=${encodeURIComponent(t.meta_capi_token)}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    } catch (e) {
      console.error("[Meta CAPI] Lead event failed:", e);
    }

    return { ok: true };
  });

export const getPublicAgencyInfo = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: settings }, { data: services }, { data: team }, { data: content }, { data: packages }] = await Promise.all([
    supabaseAdmin.from("agency_settings").select("*").eq("id", 1).maybeSingle(),
    supabaseAdmin.from("services").select("*").eq("enabled", true).order("sort_order"),
    supabaseAdmin.from("team_members").select("*").eq("enabled", true).order("sort_order"),
    supabaseAdmin.from("site_content").select("section,key,value_text,value_json,value_image_url"),
    supabaseAdmin.from("pricing_packages").select("*").eq("enabled", true).order("sort_order"),
  ]);
  const contentMap: Record<string, Record<string, any>> = {};
  for (const row of content ?? []) {
    contentMap[row.section] ??= {};
    contentMap[row.section][row.key] = row.value_text ?? row.value_image_url ?? row.value_json ?? null;
  }
  return { settings, services: services ?? [], team: team ?? [], content: contentMap, packages: packages ?? [] };
});

// Public tracking config — excludes secret CAPI token
export const getPublicTrackingSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("tracking_settings")
    .select("ga4_id, gtm_id, google_search_console, google_site_verification, google_ads_conversion_id, google_ads_label, meta_pixel_id, meta_domain_verification, tiktok_pixel_id, linkedin_partner_id, clarity_id, hotjar_id, snapchat_pixel_id, pinterest_tag_id, twitter_pixel_id, custom_head_scripts, custom_body_scripts, custom_css, custom_js, schema_markup, enabled")
    .eq("id", 1)
    .maybeSingle();
  if (!data?.enabled) return null;
  return data;
});

// Server-side tracker for arbitrary events (page views, contact clicks)
const trackEventSchema = z.object({
  event_name: z.enum(["PageView", "Contact", "Lead", "ViewContent"]),
  event_source_url: z.string().max(500).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  custom_data: z.record(z.any()).optional(),
});
export const trackServerEvent = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => trackEventSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: t } = await supabaseAdmin
        .from("tracking_settings")
        .select("meta_pixel_id, meta_capi_token, meta_test_event_code, enabled")
        .eq("id", 1)
        .maybeSingle();
      if (!t?.enabled || !t.meta_pixel_id || !t.meta_capi_token) return { ok: false };
      const req = getRequest();
      const ua = req?.headers.get("user-agent") ?? "";
      const xff = req?.headers.get("x-forwarded-for") ?? "";
      const ip = xff.split(",")[0]?.trim() || "";
      const sha256 = async (v: string) => {
        const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v.trim().toLowerCase()));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
      };
      const user_data: any = {
        client_ip_address: ip || undefined,
        client_user_agent: ua || undefined,
      };
      if (data.email) user_data.em = [await sha256(data.email)];
      if (data.phone) user_data.ph = [await sha256(data.phone.replace(/\D/g, ""))];
      const body: any = {
        data: [{
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: data.event_source_url,
          user_data,
          custom_data: data.custom_data,
        }],
      };
      if (t.meta_test_event_code) body.test_event_code = t.meta_test_event_code;
      await fetch(`https://graph.facebook.com/v21.0/${t.meta_pixel_id}/events?access_token=${encodeURIComponent(t.meta_capi_token)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return { ok: true };
    } catch (e) {
      console.error("[Meta CAPI] event failed:", e);
      return { ok: false };
    }
  });

// Grants admin role to a newly-signed-up user only if no admin exists yet.
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) === 0) {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: context.userId, role: "admin" });
      return { granted: true };
    }
    return { granted: false };
  });

// ------- ADMIN -------
async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", ctx.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

export const adminDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const iso = monthStart.toISOString();
    const [leadsM, activeProj, clientsTot, revenue, recent] = await Promise.all([
      context.supabase.from("leads").select("id", { count: "exact", head: true }).gte("created_at", iso),
      context.supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["planning", "in_progress", "review"]),
      context.supabase.from("clients").select("id", { count: "exact", head: true }),
      context.supabase.from("clients").select("total_paid"),
      context.supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(8),
    ]);
    const monthlyRevenue = (revenue.data ?? []).reduce((s: number, r: any) => s + Number(r.total_paid || 0), 0);
    return {
      leadsThisMonth: leadsM.count ?? 0,
      activeProjects: activeProj.count ?? 0,
      totalClients: clientsTot.count ?? 0,
      monthlyRevenue,
      recentLeads: recent.data ?? [],
    };
  });

const tableEnum = z.enum(["leads", "projects", "clients", "services", "blog_posts", "agency_settings", "tracking_settings", "team_members", "site_content", "pricing_packages"]);

export const adminList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: tableEnum }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const q = context.supabase.from(data.table).select("*");
    if (data.table === "team_members" || data.table === "services") q.order("sort_order", { ascending: true });
    else if (data.table === "site_content") q.order("section", { ascending: true }).order("sort_order", { ascending: true });
    else if (data.table === "pricing_packages") q.order("sort_order", { ascending: true });
    else if (data.table !== "agency_settings" && data.table !== "tracking_settings") q.order("created_at", { ascending: false });
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const adminUpsert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: tableEnum, row: z.record(z.any()) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from(data.table).upsert(data.row);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ table: tableEnum, id: z.union([z.string(), z.number()]) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// Issue a signed upload ticket so the browser can PUT the file bytes directly
// to Supabase Storage — this avoids piping large payloads through the server
// function runtime (which was causing "Bad Gateway" errors on bigger images).
const uploadTicketSchema = z.object({
  table: tableEnum,
  fileName: z.string().min(1).max(180),
  contentType: z.string().regex(/^image\//, "Only image files are allowed"),
});

export const adminCreateUploadTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => uploadTicketSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const extFromName = data.fileName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
    const extFromType = data.contentType.split("/")[1]?.toLowerCase().replace(/[^a-z0-9]/g, "");
    const ext = extFromName || extFromType || "jpg";
    const path = `${data.table}/${crypto.randomUUID()}.${ext}`;
    const { data: signed, error } = await supabaseAdmin.storage
      .from("public-media")
      .createSignedUploadUrl(path);
    if (error || !signed) throw new Error(error?.message || "Could not prepare upload");
    return { path, token: signed.token, bucket: "public-media" as const };
  });

const signPathSchema = z.object({ path: z.string().min(1).max(400) });
export const adminSignImageUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => signPathSchema.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("public-media")
      .createSignedUrl(data.path, 60 * 60 * 24 * 365 * 10);
    if (error || !signed?.signedUrl) throw new Error(error?.message || "Could not create image URL");
    return { url: signed.signedUrl };
  });

export type LeadStatus = "new" | "contacted" | "proposal_sent" | "closed_won" | "closed_lost";