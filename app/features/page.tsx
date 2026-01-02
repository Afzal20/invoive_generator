import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    Palette,
    Download,
    Cloud,
    Mail,
    CreditCard,
    BarChart,
    Lock,
    Smartphone,
    Clock,
    Globe,
    Users,
    Repeat,
    Calculator,
    Sparkles,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Professional Templates",
        description: "Choose from 20+ beautifully designed invoice templates that make your business look professional.",
        color: "bg-blue-100 text-blue-600",
    },
    {
        icon: Zap,
        title: "30-Second Creation",
        description: "Create a complete, professional invoice in just 30 seconds. No learning curve required.",
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        icon: Download,
        title: "Instant PDF Export",
        description: "Download your invoices as high-quality PDFs, ready to send to clients immediately.",
        color: "bg-green-100 text-green-600",
    },
    {
        icon: Cloud,
        title: "Cloud Storage",
        description: "Securely store all your invoices in the cloud. Access them anytime, anywhere.",
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        icon: Mail,
        title: "Email Delivery",
        description: "Send invoices directly to clients via email with automated delivery tracking.",
        color: "bg-purple-100 text-purple-600",
    },
    {
        icon: CreditCard,
        title: "Payment Tracking",
        description: "Track which invoices are paid, pending, or overdue with our payment management system.",
        color: "bg-pink-100 text-pink-600",
    },
    {
        icon: Repeat,
        title: "Recurring Invoices",
        description: "Set up automatic recurring invoices for regular clients and subscriptions.",
        color: "bg-orange-100 text-orange-600",
    },
    {
        icon: Calculator,
        title: "Auto Calculations",
        description: "Automatic tax, discount, and total calculations. No math errors, ever.",
        color: "bg-teal-100 text-teal-600",
    },
    {
        icon: Palette,
        title: "Custom Branding",
        description: "Add your logo, brand colors, and custom fields to match your business identity.",
        color: "bg-red-100 text-red-600",
    },
    {
        icon: Globe,
        title: "Multi-Currency",
        description: "Support for 150+ currencies with automatic conversion rates.",
        color: "bg-cyan-100 text-cyan-600",
    },
    {
        icon: BarChart,
        title: "Analytics Dashboard",
        description: "Track your revenue, outstanding payments, and business insights in real-time.",
        color: "bg-violet-100 text-violet-600",
    },
    {
        icon: Lock,
        title: "Secure & Private",
        description: "Bank-level encryption ensures your data is always safe and secure.",
        color: "bg-gray-100 text-gray-600",
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Create and manage invoices on the go with our mobile-optimized interface.",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        icon: Users,
        title: "Client Management",
        description: "Store client information and history for faster invoice creation.",
        color: "bg-amber-100 text-amber-600",
    },
    {
        icon: Clock,
        title: "Time Tracking",
        description: "Track billable hours and convert them directly into invoices.",
        color: "bg-lime-100 text-lime-600",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Suggestions",
        description: "Get smart suggestions for line items, descriptions, and pricing.",
        color: "bg-fuchsia-100 text-fuchsia-600",
    },
];

export default function FeaturesPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Powerful Features
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Everything You Need to Invoice Like a Pro
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Create, send, and track professional invoices with powerful features designed for modern businesses.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={index}
                                    className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300"
                                >
                                    <CardHeader>
                                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">Create professional invoices in three simple steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold mb-2">Enter Details</h3>
                                <p className="text-gray-600">
                                    Fill in your business and client information, add line items and amounts.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold mb-2">Choose Template</h3>
                                <p className="text-gray-600">
                                    Select from professional templates and customize with your branding.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold mb-2">Send & Track</h3>
                                <p className="text-gray-600">
                                    Download PDF or send via email. Track payment status in real-time.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                        <CardContent className="p-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Experience These Features?
                            </h2>
                            <p className="text-xl text-indigo-100 mb-8">
                                Start creating professional invoices in seconds
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="/create"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    Get Started Free
                                </a>
                                <a
                                    href="/pricing"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors border border-indigo-400"
                                >
                                    View Pricing
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}