import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


import { createClient } from "@/lib/supabase/server"

import { Suspense } from "react"

async function AppSidebarWithUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AppSidebar user={user} />
}

export default function Page() {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebar />}>
        <AppSidebarWithUser />
      </Suspense>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
