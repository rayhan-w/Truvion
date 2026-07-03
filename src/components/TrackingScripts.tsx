import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRouterState } from "@tanstack/react-router";
import { getPublicTrackingSettings, trackServerEvent } from "@/lib/api.functions";

declare global {
  interface Window { dataLayer?: any[]; gtag?: (...args: any[]) => void; fbq?: any; _fbq?: any; ttq?: any; clarity?: any; hj?: any; }
}

function inject(id: string, html: string, position: "head" | "body" = "head") {
  if (typeof document === "undefined" || !html.trim()) return;
  if (document.getElementById(id)) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const parent = position === "head" ? document.head : document.body;
  Array.from(tpl.content.childNodes).forEach((n, i) => {
    if (n.nodeType === 1) {
      const el = n as HTMLElement;
      const clone = document.createElement(el.tagName);
      Array.from(el.attributes).forEach(a => clone.setAttribute(a.name, a.value));
      clone.innerHTML = el.innerHTML;
      if (i === 0) clone.id = id;
      parent.appendChild(clone);
    }
  });
}

function loadScript(id: string, src: string, extra: Record<string, string> = {}) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id; s.async = true; s.src = src;
  Object.entries(extra).forEach(([k, v]) => s.setAttribute(k, v));
  document.head.appendChild(s);
}

function loadInline(id: string, code: string) {
  if (typeof document === "undefined" || document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id; s.text = code;
  document.head.appendChild(s);
}

export function TrackingScripts() {
  const fn = useServerFn(getPublicTrackingSettings);
  const track = useServerFn(trackServerEvent);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const initialised = useRef(false);

  const { data: t } = useQuery({
    queryKey: ["public_tracking"],
    queryFn: () => fn({ data: undefined as any }),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!t || initialised.current) return;
    initialised.current = true;

    // Verification meta tags
    const addMeta = (name: string, content: string) => {
      if (!content || document.querySelector(`meta[name="${name}"]`)) return;
      const m = document.createElement("meta");
      m.name = name; m.content = content; document.head.appendChild(m);
    };
    if (t.google_site_verification) addMeta("google-site-verification", t.google_site_verification);
    if (t.google_search_console) addMeta("google-site-verification", t.google_search_console);
    if (t.meta_domain_verification) addMeta("facebook-domain-verification", t.meta_domain_verification);

    // GA4
    if (t.ga4_id) {
      loadScript("tr-ga4-src", `https://www.googletagmanager.com/gtag/js?id=${t.ga4_id}`);
      loadInline("tr-ga4-init", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${t.ga4_id}');`);
    }
    // GTM
    if (t.gtm_id) {
      loadInline("tr-gtm-init", `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${t.gtm_id}');`);
    }
    // Google Ads
    if (t.google_ads_conversion_id && !t.ga4_id) {
      loadScript("tr-gads-src", `https://www.googletagmanager.com/gtag/js?id=${t.google_ads_conversion_id}`);
      loadInline("tr-gads-init", `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${t.google_ads_conversion_id}');`);
    }
    // Meta Pixel
    if (t.meta_pixel_id) {
      loadInline("tr-fbq-init", `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.meta_pixel_id}');fbq('track','PageView');`);
    }
    // TikTok Pixel
    if (t.tiktok_pixel_id) {
      loadInline("tr-ttq-init", `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${t.tiktok_pixel_id}');ttq.page();}(window,document,'ttq');`);
    }
    // LinkedIn
    if (t.linkedin_partner_id) {
      loadInline("tr-li-init", `_linkedin_partner_id="${t.linkedin_partner_id}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`);
    }
    // Clarity
    if (t.clarity_id) {
      loadInline("tr-clarity-init", `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${t.clarity_id}");`);
    }
    // Hotjar
    if (t.hotjar_id) {
      loadInline("tr-hj-init", `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${t.hotjar_id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`);
    }
    // Snapchat
    if (t.snapchat_pixel_id) {
      loadInline("tr-snap-init", `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');snaptr('init','${t.snapchat_pixel_id}');snaptr('track','PAGE_VIEW');`);
    }
    // Pinterest
    if (t.pinterest_tag_id) {
      loadInline("tr-pin-init", `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${t.pinterest_tag_id}');pintrk('page');`);
    }
    // Twitter/X
    if (t.twitter_pixel_id) {
      loadInline("tr-tw-init", `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${t.twitter_pixel_id}');`);
    }

    // Custom head/body scripts + CSS/JS
    if (t.custom_css) {
      const style = document.createElement("style");
      style.id = "tr-custom-css"; style.innerHTML = t.custom_css; document.head.appendChild(style);
    }
    if (t.custom_js) loadInline("tr-custom-js", t.custom_js);
    if (t.custom_head_scripts) inject("tr-custom-head", t.custom_head_scripts, "head");
    if (t.custom_body_scripts) inject("tr-custom-body", t.custom_body_scripts, "body");
    if (t.schema_markup) inject("tr-schema", t.schema_markup, "head");
  }, [t]);

  // Track SPA pageviews (client + server)
  useEffect(() => {
    if (!t) return;
    const url = typeof window !== "undefined" ? window.location.href : undefined;
    try {
      if (window.gtag && t.ga4_id) window.gtag("event", "page_view", { page_path: pathname });
      if (window.fbq && t.meta_pixel_id) window.fbq("track", "PageView");
      if (window.ttq && t.tiktok_pixel_id) window.ttq.page();
    } catch {}
    // Server-side PageView (Meta CAPI) — fire and forget
    track({ data: { event_name: "PageView", event_source_url: url } }).catch(() => {});
  }, [pathname, t, track]);

  return null;
}

// Helper hook for one-off contact click tracking
export function useTrackContactClick() {
  const track = useServerFn(trackServerEvent);
  return (channel: "whatsapp" | "phone" | "email") => {
    try {
      if (typeof window !== "undefined") {
        if (window.fbq) window.fbq("track", "Contact", { channel });
        if (window.gtag) window.gtag("event", "contact_click", { channel });
      }
    } catch {}
    const url = typeof window !== "undefined" ? window.location.href : undefined;
    track({ data: { event_name: "Contact", event_source_url: url, custom_data: { channel } } }).catch(() => {});
  };
}