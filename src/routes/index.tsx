import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/components/landing/LandingPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Truvion Tech — We Build Brands That Dominate Digitally" },
      { name: "description", content: "Bangladesh's fastest-growing digital agency. Websites, Facebook Ads, SEO, social media management, and business digitalization that converts." },
      { property: "og:title", content: "Truvion Tech — Digital Agency in Bangladesh" },
      { property: "og:description", content: "Websites, Facebook Ads, SEO & more — built to dominate digitally." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digital-gemini-suite.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://digital-gemini-suite.lovable.app/" }],
  }),
  component: LandingPage,
});
