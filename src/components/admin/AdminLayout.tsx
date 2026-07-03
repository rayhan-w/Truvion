import { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Zap, LayoutDashboard, Inbox, FolderKanban, Users, Wrench, FileText, Settings, LogOut, LineChart, UserCog, Pencil, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/pricing", label: "Pricing Packages", icon: DollarSign },
  { to: "/admin/team", label: "Team Members", icon: UserCog },
  { to: "/admin/content", label: "Site Content", icon: Pencil },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/tracking", label: "Tracking", icon: LineChart },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: s => s.location.pathname });
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 border-r border-border bg-sidebar flex flex-col">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 font-display font-bold border-b border-border">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-primary text-primary-foreground"><Zap className="h-4 w-4" /></span>
          Truvion <span className="text-primary">Tech</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <Button onClick={signOut} variant="ghost" size="sm" className="m-3 justify-start"><LogOut className="h-4 w-4 mr-2" /> Sign Out</Button>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6">
          <h1 className="text-xl font-semibold">{title}</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}