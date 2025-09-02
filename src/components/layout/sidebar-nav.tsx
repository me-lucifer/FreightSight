
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardCheck,
  FileText,
  FlaskConical,
  Inbox,
  LayoutDashboard,
  Settings,
  ChevronRight,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox-inspector", label: "Inbox Inspector", icon: Inbox },
  { href: "/extraction-log", label: "Extraction Log", icon: FileText },
];

const bottomMenuItems = [
    { href: "/parser-lab", label: "Parser Lab", icon: FlaskConical },
    { href: "/review-queue", label: "Review Queue", icon: ClipboardCheck },
];

export function SidebarNav() {
  const pathname = usePathname();
  const isSettingsPage = pathname.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(isSettingsPage);

  useEffect(() => {
    setSettingsOpen(pathname.startsWith("/settings"));
  }, [pathname]);

  return (
    <div className="flex h-full flex-col justify-between">
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}

        <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isSettingsPage} className="group/settings">
                        <Settings />
                        <span>Settings</span>
                        <ChevronRight className={cn("ml-auto size-4 transition-transform duration-200", settingsOpen && "rotate-90")} />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
            </SidebarMenuItem>
            <CollapsibleContent asChild>
                <SidebarMenuSub>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/settings/destinations'}>
                          <Link href="/settings/destinations">Destinations</Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/settings/field-mapping'}>
                          <Link href="/settings/field-mapping">Field Mapping</Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === '/settings/labels'}>
                           <Link href="/settings/labels">Labels</Link>
                        </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>

      <SidebarMenu>
        {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
