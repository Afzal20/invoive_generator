import { PricingToggle } from "@/components/pricing/pricing-toggle";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Shield, Zap } from "lucide-react";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Transparent Pricing
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Simple Pricing, Powerful Features
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                        Choose the perfect plan for your business. Start free, upgrade when you need more.
                        No hidden fees, cancel anytime.
                    </p>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                                    <Check className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-2">14-Day Free Trial</h3>
                                <p className="text-sm text-gray-600">Try any plan risk-free. No credit card required.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-2">30-Day Money Back</h3>
                                <p className="text-sm text-gray-600">Not satisfied? Get a full refund within 30 days.</p>
                            </CardContent>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-4">
                                    <Zap className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-semibold mb-2">Cancel Anytime</h3>
                                <p className="text-sm text-gray-600">No long-term contracts. Switch or cancel anytime.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Toggle Section */}
            <section className="py-16 px-4">
                <PricingToggle />
            </section>

            {/* Comparison Table */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Compare Plans in Detail
                        </h2>
                        <p className="text-lg text-gray-600">
                            See exactly what's included in each plan
                        </p>
                    </div>
                    <PricingComparison />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4">
                <PricingFAQ />
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 text-indigo-100">
                        Join thousands of freelancers and businesses creating professional invoices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/create"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Start Free Trial
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-700 text-white font-semibold rounded-lg hover:bg-indigo-800 transition-colors border border-indigo-400"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}