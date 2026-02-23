"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Suspense } from "react"

import { StatsSection } from "@/components/dashboard/stats-section"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentInvoices } from "@/components/dashboard/recent-invoices"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { TopClients } from "@/components/dashboard/top-clients"

// TypeScript interfaces
interface Invoice {
    id: string
    number: string
    clientName: string
    clientAvatar?: string
    amount: number
    status: "paid" | "pending" | "overdue"
    date: string
    dueDate: string
}

interface Client {
    id: string
    name: string
    avatar?: string
    totalRevenue: number
    invoiceCount: number
    percentage: number
}

interface DashboardStats {
    totalRevenue: number
    revenueChange: number
    invoicesCreated: number
    invoicesChange: number
    pendingPayments: number
    pendingChange: number
    paidThisMonth: number
    paidChange: number
}

interface RevenueData {
    month: string
    revenue: number
    previousYear: number
}

// Mock data
const mockInvoices: Invoice[] = [
    {
        id: "1",
        number: "INV-2024-001",
        clientName: "Acme Corporation",
        amount: 5420.0,
        status: "paid",
        date: "2024-01-15",
        dueDate: "2024-02-15",
    },
    {
        id: "2",
        number: "INV-2024-002",
        clientName: "TechStart Inc.",
        amount: 2840.5,
        status: "pending",
        date: "2024-01-20",
        dueDate: "2024-02-20",
    },
    {
        id: "3",
        number: "INV-2024-003",
        clientName: "Global Dynamics",
        amount: 7890.0,
        status: "overdue",
        date: "2024-01-10",
        dueDate: "2024-02-10",
    },
    {
        id: "4",
        number: "INV-2024-004",
        clientName: "Creative Studio",
        amount: 1560.75,
        status: "paid",
        date: "2024-01-25",
        dueDate: "2024-02-25",
    },
    {
        id: "5",
        number: "INV-2024-005",
        clientName: "Digital Solutions",
        amount: 4320.0,
        status: "pending",
        date: "2024-01-22",
        dueDate: "2024-02-22",
    },
    {
        id: "6",
        number: "INV-2024-006",
        clientName: "Innovation Labs",
        amount: 6780.25,
        status: "paid",
        date: "2024-01-18",
        dueDate: "2024-02-18",
    },
    {
        id: "7",
        number: "INV-2024-007",
        clientName: "Future Systems",
        amount: 3210.5,
        status: "overdue",
        date: "2024-01-12",
        dueDate: "2024-02-12",
    },
]

const mockClients: Client[] = [
    {
        id: "1",
        name: "Acme Corporation",
        totalRevenue: 12450.0,
        invoiceCount: 8,
        percentage: 28.5,
    },
    {
        id: "2",
        name: "Global Dynamics",
        totalRevenue: 9870.0,
        invoiceCount: 6,
        percentage: 22.8,
    },
    {
        id: "3",
        name: "TechStart Inc.",
        totalRevenue: 7640.5,
        invoiceCount: 12,
        percentage: 17.6,
    },
    {
        id: "4",
        name: "Innovation Labs",
        totalRevenue: 6780.25,
        invoiceCount: 4,
        percentage: 15.7,
    },
    {
        id: "5",
        name: "Digital Solutions",
        totalRevenue: 5320.0,
        invoiceCount: 7,
        percentage: 12.3,
    },
]

const mockStats: DashboardStats = {
    totalRevenue: 43680.5,
    revenueChange: 12.3,
    invoicesCreated: 27,
    invoicesChange: 8.7,
    pendingPayments: 15420.75,
    pendingChange: -2.1,
    paidThisMonth: 28259.75,
    paidChange: 15.8,
}

const mockRevenueData: RevenueData[] = [
    { month: "Aug 2023", revenue: 28000, previousYear: 24000 },
    { month: "Sep 2023", revenue: 31000, previousYear: 26500 },
    { month: "Oct 2023", revenue: 35000, previousYear: 29000 },
    { month: "Nov 2023", revenue: 38000, previousYear: 31500 },
    { month: "Dec 2023", revenue: 42000, previousYear: 35000 },
    { month: "Jan 2024", revenue: 44000, previousYear: 37500 },
]

export default function DashboardPage() {
    return (
        <SidebarProvider>
            <Suspense fallback={null}>
                <AppSidebar />
            </Suspense>
            <SidebarInset>
                {/* Main Content */}
                <div className="flex-1 space-y-6 p-6 bg-gray-50/50 min-h-screen relative">
                    {/* Sidebar Toggle Button */}
                    <div className="absolute top-6 left-6 z-10">
                        <SidebarTrigger className="bg-white shadow-md hover:shadow-lg transition-shadow" />
                    </div>
                    
                    <StatsSection stats={mockStats} />
                    <QuickActions />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <RecentInvoices invoices={mockInvoices} />
                        </div>
                        <div>
                            <TopClients clients={mockClients} />
                        </div>
                    </div>

                    <RevenueChart data={mockRevenueData} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
