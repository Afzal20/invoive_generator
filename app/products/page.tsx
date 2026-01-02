import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, FileText, Zap, Check } from "lucide-react";

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                        <Package className="h-3 w-3 mr-1" />
                        Product Management
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Manage Your Products & Services
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-8">
                        Create a product catalog to speed up invoice creation. Add items once, use them forever.
                    </p>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" asChild>
                        <a href="/dashboard">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Product
                        </a>
                    </Button>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Why Use Product Management?</h2>
                        <p className="text-lg text-gray-600">
                            Save time and ensure consistency across all your invoices
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-indigo-600" />
                                </div>
                                <CardTitle>Lightning Fast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Create invoices in seconds by selecting pre-saved products instead of typing
                                    everything from scratch.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Check className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle>Consistent Pricing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Ensure you always charge the right price for your products and services with
                                    saved pricing.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Professional Descriptions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Write detailed product descriptions once and reuse them to maintain a
                                    professional image.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How Product Management Works</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold mb-2">Add Products</h3>
                                <p className="text-gray-600">
                                    Create your product catalog with names, descriptions, prices, and categories.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold mb-2">Select & Invoice</h3>
                                <p className="text-gray-600">
                                    When creating invoices, simply select products from your catalog with one click.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-lg">
                            <CardContent className="pt-8">
                                <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold mb-2">Update Anytime</h3>
                                <p className="text-gray-600">
                                    Change prices or descriptions anytime, and they'll be ready for your next invoice.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features List */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-0 shadow-xl">
                        <CardHeader className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                            <CardTitle className="text-2xl">Product Management Features</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Unlimited Products</h4>
                                        <p className="text-sm text-gray-600">Add as many products and services as you need</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Custom Categories</h4>
                                        <p className="text-sm text-gray-600">Organize products into custom categories</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Price Variations</h4>
                                        <p className="text-sm text-gray-600">Set different prices for different clients</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Tax Configuration</h4>
                                        <p className="text-sm text-gray-600">Set default tax rates per product</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Quick Search</h4>
                                        <p className="text-sm text-gray-600">Find products instantly with search</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="font-semibold mb-1">Bulk Import</h4>
                                        <p className="text-sm text-gray-600">Import products from CSV files</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Organize Your Products?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Start managing your product catalog today
                    </p>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" size="lg" asChild>
                        <a href="/dashboard">Get Started Now</a>
                    </Button>
                </div>
            </section>
        </main>
    );
}