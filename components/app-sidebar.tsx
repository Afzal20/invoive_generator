import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import type { ComponentProps } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server";

type Team = Parameters<typeof TeamSwitcher>[0]["teams"][number]
type NavMainItem = Parameters<typeof NavMain>[0]["items"][number]
type Project = Parameters<typeof NavProjects>[0]["projects"][number]

// This is sample data.
const data: {
  teams: Team[]
  navMain: NavMainItem[]
  projects: Project[]
} = {
  teams: [
    {
      name: "Primary Organization",
      logo: "gallery-vertical-end",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Clients",
      url: "/invoices/{id}",
      icon: "square-terminal",
      isActive: true,
      items: [
        {
          title: "History",
          url: "/invoices/{id}",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: "bot",
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Invoices",
      url: "#",
      icon: "book-open",
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "settings-2",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: "frame",
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: "pie-chart",
    },
    {
      name: "Travel",
      url: "#",
      icon: "map",
    },
  ],
}

interface AppSidebarProps extends ComponentProps<typeof Sidebar> {
  user?: User | null
}

export async function AppSidebar({ user, ...props }: AppSidebarProps) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const userData = {
    name: currentUser?.user_metadata?.full_name || currentUser?.email?.split("@")[0] || "User",
    email: currentUser?.email || "",
    avatar: currentUser?.user_metadata?.avatar_url || "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
