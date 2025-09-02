import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-sidebar-border"
        variant="sidebar"
      >
        <SidebarHeader className="border-b border-sidebar-border p-3">
          <div
            className={cn(
              "flex items-center gap-3 overflow-hidden transition-all duration-200",
              "group-data-[collapsible=icon]:w-10"
            )}
          >
            <div className="flex items-center gap-3">
              <Icons.logo className="size-6 shrink-0" />
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-primary">
                  FreightSight
                </h1>
                <p className="text-xs text-muted-foreground">
                  Turn Outlook emails into structured quote insights
                </p>
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
