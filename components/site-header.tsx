"use client"

import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const titles: { match: string; title: string }[] = [
  { match: "/dashboard", title: "Dashboard" },
  { match: "/invoices", title: "Invoices" },
  { match: "/create-invoice", title: "Create Invoice" },
  { match: "/clients", title: "Clients" },
  { match: "/create-client", title: "New Client" },
  { match: "/products", title: "Products" },
  { match: "/create-product", title: "New Product" },
  { match: "/expenses", title: "Expenses" },
  { match: "/reports", title: "Reports" },
  { match: "/team", title: "My Team" },
  { match: "/settings", title: "Settings" },
  { match: "/search", title: "Search" },
  { match: "/help", title: "Help" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const title =
    titles.find((t) => pathname?.startsWith(t.match))?.title ?? "Dashboard"

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  )
}
