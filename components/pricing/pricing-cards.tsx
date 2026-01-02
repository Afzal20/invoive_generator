"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, X } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for trying out",
    badge: null,
    features: [
      { name: "10 invoices per month", included: true },
      { name: "3 templates", included: true },
      { name: "PDF download", included: true },
      { name: "Cloud storage", included: false },
      { name: "Email delivery", included: false },
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: 9,
    description: "For serious freelancers",
    badge: "MOST POPULAR",
    features: [
      { name: "Unlimited invoices", included: true },
      { name: "20+ templates", included: true },
      { name: "Cloud storage", included: true },
      { name: "Email delivery", included: true },
      { name: "Payment tracking", included: true },
      { name: "Custom branding", included: true },
    ],
    cta: "Start Free Trial",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Business",
    price: 29,
    description: "For teams & agencies",
    badge: null,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "5 team members", included: true },
      { name: "API access", included: true },
      { name: "White-label", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
];

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {pricingTiers.map((tier) => (
        <Card
          key={tier.name}
          className={`relative ${
            tier.popular
              ? "border-indigo-500 shadow-2xl scale-105"
              : "border-gray-200"
          }`}
        >
          {tier.badge && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 border-0">
                {tier.badge}
              </Badge>
            </div>
          )}
          
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
            <div className="mb-2">
              <span className="text-5xl font-bold">${tier.price}</span>
              <span className="text-gray-500">/month</span>
            </div>
            <CardDescription>{tier.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature.name}
                  className="flex items-start gap-2"
                >
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                  )}
                  <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              variant={tier.variant}
              asChild
            >
              <Link href="/create">{tier.cta}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
