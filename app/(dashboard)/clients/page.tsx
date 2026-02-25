"use client"

import * as React from "react"
import {
  IconDots,
  IconMail,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Client = {
  id: string
  name: string
  email: string
  phone: string
  totalInvoices: number
  totalRevenue: number
  status: "active" | "inactive"
  lastInvoice: string
}

const clients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
    totalInvoices: 12,
    totalRevenue: 24500.0,
    status: "active" as const,
    lastInvoice: "2024-01-15",
  },
  {
    id: "2",
    name: "TechStart Inc.",
    email: "accounts@techstart.io",
    phone: "+1 (555) 234-5678",
    totalInvoices: 8,
    totalRevenue: 18200.5,
    status: "active" as const,
    lastInvoice: "2024-01-20",
  },
  {
    id: "3",
    name: "Global Dynamics",
    email: "finance@globaldyn.com",
    phone: "+1 (555) 345-6789",
    totalInvoices: 15,
    totalRevenue: 42800.0,
    status: "active" as const,
    lastInvoice: "2024-01-10",
  },
  {
    id: "4",
    name: "Creative Studio",
    email: "hello@creativestudio.co",
    phone: "+1 (555) 456-7890",
    totalInvoices: 3,
    totalRevenue: 5600.75,
    status: "inactive" as const,
    lastInvoice: "2023-11-05",
  },
  {
    id: "5",
    name: "Digital Solutions",
    email: "pay@digitalsol.com",
    phone: "+1 (555) 567-8901",
    totalInvoices: 6,
    totalRevenue: 15320.0,
    status: "active" as const,
    lastInvoice: "2024-01-22",
  },
  {
    id: "6",
    name: "Innovation Labs",
    email: "accounts@innolabs.dev",
    phone: "+1 (555) 678-9012",
    totalInvoices: 9,
    totalRevenue: 31450.25,
    status: "active" as const,
    lastInvoice: "2024-01-18",
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export default function ClientsPage() {
  const [search, setSearch] = React.useState("")

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0)
  const activeClients = clients.filter((c) => c.status === "active").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats Cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Clients</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {clients.length}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +3
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Growing client base <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">3 new clients this month</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Active Clients</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {activeClients}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +2
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  High engagement <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  {Math.round((activeClients / clients.length) * 100)}% active rate
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(totalRevenue)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +18.2%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Revenue trending up <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">From all client invoices</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Avg. Revenue per Client</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(totalRevenue / clients.length)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingDown />
                    -2.1%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Slight decrease <IconTrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">More smaller clients added</div>
              </CardFooter>
            </Card>
          </div>

          {/* Client Table */}
          <div className="px-4 lg:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All Clients</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search clients..."
                      className="pl-9 w-62.5"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button size="sm">
                    <IconPlus className="size-4" />
                    Add Client
                  </Button>
                </div>
              </div>
              <TabsContent value="all" className="mt-4">
                <ClientTable clients={filteredClients} />
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                <ClientTable clients={filteredClients.filter((c) => c.status === "active")} />
              </TabsContent>
              <TabsContent value="inactive" className="mt-4">
                <ClientTable clients={filteredClients.filter((c) => c.status === "inactive")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientTable({ clients }: { clients: Client[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Invoices</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <IconMail className="size-3" />
                      {client.email}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <IconPhone className="size-3" />
                      {client.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {client.totalInvoices}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatCurrency(client.totalRevenue)}
                </TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "default" : "secondary"}>
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Client</DropdownMenuItem>
                      <DropdownMenuItem>Create Invoice</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
