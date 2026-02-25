"use client"

import * as React from "react"
import {
  IconDots,
  IconDownload,
  IconEye,
  IconPlus,
  IconSearch,
  IconSend,
  IconTrendingDown,
  IconTrendingUp,
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

type InvoiceStatus = "paid" | "pending" | "overdue" | "draft"

type Invoice = {
  id: string
  number: string
  client: string
  amount: number
  status: InvoiceStatus
  issueDate: string
  dueDate: string
}

const invoices: Invoice[] = [
  {
    id: "1",
    number: "INV-2024-001",
    client: "Acme Corporation",
    amount: 5420.0,
    status: "paid" as const,
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
  },
  {
    id: "2",
    number: "INV-2024-002",
    client: "TechStart Inc.",
    amount: 2840.5,
    status: "pending" as const,
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
  },
  {
    id: "3",
    number: "INV-2024-003",
    client: "Global Dynamics",
    amount: 7890.0,
    status: "overdue" as const,
    issueDate: "2024-01-10",
    dueDate: "2024-02-10",
  },
  {
    id: "4",
    number: "INV-2024-004",
    client: "Creative Studio",
    amount: 1560.75,
    status: "paid" as const,
    issueDate: "2024-01-25",
    dueDate: "2024-02-25",
  },
  {
    id: "5",
    number: "INV-2024-005",
    client: "Digital Solutions",
    amount: 4320.0,
    status: "pending" as const,
    issueDate: "2024-01-22",
    dueDate: "2024-02-22",
  },
  {
    id: "6",
    number: "INV-2024-006",
    client: "Innovation Labs",
    amount: 6780.25,
    status: "paid" as const,
    issueDate: "2024-01-18",
    dueDate: "2024-02-18",
  },
  {
    id: "7",
    number: "INV-2024-007",
    client: "Future Systems",
    amount: 3210.5,
    status: "overdue" as const,
    issueDate: "2024-01-12",
    dueDate: "2024-02-12",
  },
  {
    id: "8",
    number: "INV-2024-008",
    client: "Acme Corporation",
    amount: 9150.0,
    status: "draft" as const,
    issueDate: "2024-01-28",
    dueDate: "2024-02-28",
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const statusStyles: Record<InvoiceStatus, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export default function InvoicesPage() {
  const [search, setSearch] = React.useState("")

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
  )

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status === "pending" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats Cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Invoices</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {invoices.length}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +5
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Invoicing activity up <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">5 new invoices this month</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Billed</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(totalAmount)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +12.5%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Revenue growing <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Across all invoices</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Paid</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(paidAmount)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +8.3%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Collection improving <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  {invoices.filter((i) => i.status === "paid").length} invoices paid
                </div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Outstanding</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {formatCurrency(pendingAmount)}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingDown />
                    -4.2%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Pending payments <IconTrendingDown className="size-4" />
                </div>
                <div className="text-muted-foreground">Needs follow-up</div>
              </CardFooter>
            </Card>
          </div>

          {/* Invoice Table */}
          <div className="px-4 lg:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invoices..."
                      className="pl-9 w-62.5"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button size="sm">
                    <IconPlus className="size-4" />
                    New Invoice
                  </Button>
                </div>
              </div>
              <TabsContent value="all" className="mt-4">
                <InvoiceTable invoices={filteredInvoices} />
              </TabsContent>
              <TabsContent value="paid" className="mt-4">
                <InvoiceTable invoices={filteredInvoices.filter((i) => i.status === "paid")} />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <InvoiceTable invoices={filteredInvoices.filter((i) => i.status === "pending")} />
              </TabsContent>
              <TabsContent value="overdue" className="mt-4">
                <InvoiceTable invoices={filteredInvoices.filter((i) => i.status === "overdue")} />
              </TabsContent>
              <TabsContent value="draft" className="mt-4">
                <InvoiceTable invoices={filteredInvoices.filter((i) => i.status === "draft")} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium font-mono text-sm">
                  {invoice.number}
                </TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {formatCurrency(invoice.amount)}
                </TableCell>
                <TableCell>
                  <Badge className={statusStyles[invoice.status]} variant="secondary">
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(invoice.issueDate)}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(invoice.dueDate)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconDots className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <IconEye className="size-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconSend className="size-4" />
                        Send
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <IconDownload className="size-4" />
                        Download PDF
                      </DropdownMenuItem>
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