
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="w-full">
          <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-card border-b shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger />
              <h1 className="text-sm md:text-lg font-semibold title-color hidden sm:block">
                Finance Assistant Lustoza
              </h1>
            </div>
            <ThemeToggle />
          </header>
          <div className="flex-1 p-4 md:p-6 bg-background w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
