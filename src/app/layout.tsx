import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import SidebarNav from '@/components/layout/sidebar-nav';
import UserNav from '@/components/layout/user-nav';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'ContentCraft AI',
  description: 'AI-Powered SEO & Content Co-Pilot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable, "antialiased font-sans")}>
        <SidebarProvider defaultOpen>
          <Sidebar className="border-sidebar-border" collapsible="icon">
            <SidebarHeader className="p-4 border-b border-sidebar-border">
              <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary group-data-[collapsible=icon]:text-sidebar-primary">
                  <path d="M12 3L4 7v10a2 2 0 002 2h12a2 2 0 002-2V7L12 3zm0 0V0m0 3L8 5m4-2l4 2m-4 5v9m-4-6l4 2m0 0l4-2"/>
                  <path d="M8 12V7L4 9v6l4-2zm8 0V7l4 2v6l-4-2z"/>
                </svg>
                <span className="text-xl font-semibold text-foreground group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:sr-only">
                  ContentCraft
                </span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-0">
              <ScrollArea className="h-full">
                <SidebarNav />
              </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="p-2 border-t border-sidebar-border group-data-[collapsible=icon]:justify-center">
              <UserNav />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-background/80 backdrop-blur-sm border-b">
              <div className="md:hidden">
                <SidebarTrigger/>
              </div>
              <div className="hidden md:block">
                 {/* Placeholder for breadcrumbs or page title if needed here */}
              </div>
              <div className="flex items-center gap-4">
                {/* Add any header actions here if needed, e.g. notifications */}
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
