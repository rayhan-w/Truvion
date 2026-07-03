import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapAdmin } from "@/lib/api.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Login — Truvion Tech" },
      { name: "description", content: "Sign in to the Truvion Tech admin panel." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — Truvion Tech" },
      { property: "og:url", content: "https://digital-gemini-suite.lovable.app/auth" },
    ],
    links: [{ rel: "canonical", href: "https://digital-gemini-suite.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const bootstrap = useServerFn(bootstrapAdmin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")), password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    try { await bootstrap({ data: undefined as any }); } catch {}
    toast.success("Welcome back");
    navigate({ to: "/admin" });
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")), password: String(fd.get("password")),
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    try {
      const res = await bootstrap({ data: undefined as any });
      if (res?.granted) toast.success("Admin account created — you're the owner!");
      else toast.success("Account created. Ask the existing admin to grant you access.");
    } catch {}
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen grid place-items-center px-4" style={{ background: "var(--gradient-hero)" }}>
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <h1 className="flex items-center gap-2 justify-center mb-6 font-display font-bold text-lg">
          <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary text-primary-foreground" aria-hidden="true"><Zap className="h-5 w-5" /></span>
          <span>Admin Authentication — Truvion <span className="text-primary">Tech</span></span>
        </h1>
        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Create Account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={signIn} className="grid gap-4">
              <Field name="email" type="email" label="Email" defaultValue="admin@truviontech.com" />
              <Field name="password" type="password" label="Password" defaultValue="" />
              <Button type="submit" disabled={loading} className="font-semibold">{loading ? "Signing in…" : "Sign In"}</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={signUp} className="grid gap-4">
              <Field name="email" type="email" label="Email" />
              <Field name="password" type="password" label="Password (min 6)" minLength={6} />
              <Button type="submit" disabled={loading} className="font-semibold">{loading ? "Creating…" : "Create Account"}</Button>
              <p className="text-xs text-muted-foreground text-center">The first account created becomes the admin owner.</p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function Field(props: any) {
  return (
    <div>
      <Label className="mb-2 block" htmlFor={props.name}>{props.label}</Label>
      <Input id={props.name} required {...props} />
    </div>
  );
}