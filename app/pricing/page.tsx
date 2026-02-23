import { PricingToggle } from "@/components/pricing/pricing-toggle";
import { PricingComparison } from "@/components/pricing/pricing-comparison";
import { PricingFAQ } from "@/components/pricing/pricing-faq";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Shield, Zap } from "lucide-react";

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
             {/* Decorative dots - top right */}
             <div className="absolute top-20 right-20 grid grid-cols-3 gap-2 opacity-30 pointer-events-none">
                {Array.from({ length: 27 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                ))}
            </div>

            {/* Decorative dots - bottom left */}
            <div className="absolute bottom-40 left-20 grid grid-cols-3 gap-2 opacity-30 pointer-events-none">
                {Array.from({ length: 27 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                ))}
            </div>

            {/* Floating elements */}
            <div className="absolute top-32 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse pointer-events-none"></div>
            <div className="absolute bottom-32 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 relative z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6 border border-white/10">
                        <Sparkles className="h-3 w-3 text-yellow-300" />
                        <span className="text-blue-100">Transparent Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Simple Pricing, <span className="bg-gradient-to-r from-[#4ade80] via-[#86efac] to-[#d9f99d] bg-clip-text text-transparent">Powerful Features</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed">
                        Choose the perfect plan for your business. Start free, upgrade when you need more.
                        No hidden fees, cancel anytime.
                    </p>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="pb-16 px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-4 group-hover:scale-110 transition-transform">
                                    <Check className="h-6 w-6 text-green-300" />
                                </div>
                                <h3 className="font-semibold mb-2 text-white">14-Day Free Trial</h3>
                                <p className="text-sm text-blue-100">Try any plan risk-free. No credit card required.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/20 mb-4 group-hover:scale-110 transition-transform">
                                    <Shield className="h-6 w-6 text-blue-300" />
                                </div>
                                <h3 className="font-semibold mb-2 text-white">30-Day Money Back</h3>
                                <p className="text-sm text-blue-100">Not satisfied? Get a full refund within 30 days.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group">
                            <CardContent className="pt-6 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6 text-purple-300" />
                                </div>
                                <h3 className="font-semibold mb-2 text-white">Cancel Anytime</h3>
                                <p className="text-sm text-blue-100">No long-term contracts. Switch or cancel anytime.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Toggle Section */}
            <section className="py-16 px-4 relative z-10">
                <PricingToggle />
            </section>

            {/* Comparison Table */}
            <section className="py-16 px-4 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Compare Plans in Detail
                        </h2>
                        <p className="text-lg text-blue-100">
                            See exactly what's included in each plan
                        </p>
                    </div>
                    <PricingComparison />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 relative z-10">
                <PricingFAQ />
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 mt-10 relative z-10">
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-sm -z-10"></div>
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Join thousands of freelancers and businesses creating professional invoices.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/create"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:scale-105 transform duration-200"
                        >
                            Start Free Trial
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Contact Sales
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}