import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Zap, Heart, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-0">
                        About Us
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Simplifying Invoicing for Everyone
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        We're on a mission to help freelancers and small businesses create professional invoices
                        in seconds, not hours. No complexity, just results.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8 md:p-12">
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    Invoice Generator was born from a simple frustration: creating professional invoices
                                    shouldn't require expensive software or hours of work. As freelancers ourselves, we
                                    experienced the pain of complicated invoicing tools that got in the way of actually
                                    running our businesses.
                                </p>
                                <p>
                                    In 2024, we set out to build something different. A tool so simple, anyone could
                                    create a beautiful invoice in 30 seconds. No signups, no learning curve, just
                                    professional results.
                                </p>
                                <p>
                                    Today, thousands of freelancers, small businesses, and entrepreneurs trust Invoice
                                    Generator to handle their invoicing needs. We're proud to be part of their success
                                    story.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
                        <p className="text-lg text-gray-600">The principles that guide everything we do</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-indigo-600" />
                                </div>
                                <CardTitle>Simplicity First</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    We believe great tools should be intuitive. Every feature is designed to save you
                                    time and remove complexity.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle>User-Focused</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Your feedback shapes our roadmap. We listen to our community and build features
                                    that solve real problems.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle>Lightning Fast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Time is money. Our platform is optimized for speed, so you can create invoices
                                    and get back to your work.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-pink-600" />
                                </div>
                                <CardTitle>Built with Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Every pixel, every interaction is crafted with attention to detail. We're
                                    perfectionists who care about your experience.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Award className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle>Professional Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Your invoices represent your brand. We ensure they always look polished and
                                    professional.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle>Continuous Growth</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    We're constantly improving and adding features. Your success drives our
                                    innovation.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                        <CardContent className="p-12">
                            <div className="grid md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-4xl font-bold mb-2">50K+</div>
                                    <div className="text-indigo-100">Invoices Created</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">10K+</div>
                                    <div className="text-indigo-100">Happy Users</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">30s</div>
                                    <div className="text-indigo-100">Average Time</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold mb-2">4.9/5</div>
                                    <div className="text-indigo-100">User Rating</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Create Your First Invoice?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of professionals who trust Invoice Generator
                    </p>
                    <a
                        href="/create"
                        className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                        Get Started Free
                    </a>
                </div>
            </section>
        </main>
    );
}