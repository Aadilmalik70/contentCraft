
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bot, Blend, Search, Users, Settings, LifeBuoy, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip?: string;
}

const mainNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, tooltip: "Dashboard" },
  { href: '/content-generation', label: 'Content Generation', icon: Bot, tooltip: "AI Content Generation" },
  { href: '/content-adaptation', label: 'Content Adaptation', icon: Blend, tooltip: "Adapt Content" },
  { href: '/keyword-research', label: 'Keyword Research', icon: Search, tooltip: "Keyword Research" },
  { href: '/team-management', label: 'Team Management', icon: Users, tooltip: "Team Management" },
];

const secondaryNavItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings, tooltip: "Settings" },
  { href: '/support', label: 'Support', icon: LifeBuoy, tooltip: "Support" },
];


export default function SidebarNav() {
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => (
    items.map((item) => (
      <SidebarMenuItem key={item.href}>
        <Link href={item.href} legacyBehavior passHref>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
            tooltip={item.tooltip || item.label}
            className="justify-start"
          >
            <a>
              <item.icon className="w-5 h-5" />
              <span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:sr-only">{item.label}</span>
            </a>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    ))
  );

  return (
    <div className="flex flex-col justify-between h-full p-2">
      <SidebarMenu>
        {renderNavItems(mainNavItems)}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
        {renderNavItems(secondaryNavItems)}
         <SidebarMenuItem>
            <Link href="/auth/login" legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                tooltip="Logout"
                className="justify-start"
              >
                <a>
                  <LogOut className="w-5 h-5" />
                  <span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:sr-only">Logout</span>
                </a>
              </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
