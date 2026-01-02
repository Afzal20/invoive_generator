"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Check, Zap } from "lucide-react";

const pricingData = {
  monthly: [
    {
      name: "Starter",
      price: 0,
      period: "month",
      description: "Perfect for getting started",
      features: [
        "10 invoices per month",
        "3 templates",
        "PDF export",
        "Email support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Professional",
      price: 9,
      period: "month",
      description: "Best for freelancers",
      features: [
        "Unlimited invoices",
        "20+ premium templates",
        "Cloud storage",
        "Email delivery",
        "Payment tracking",
        "Priority support",
      ],
      highlighted: true,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Enterprise",
      price: 29,
      period: "month",
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "10 team members",
        "API access",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
  ],
  yearly: [
    {
      name: "Starter",
      price: 0,
      period: "year",
      description: "Perfect for getting started",
      features: [
        "10 invoices per month",
        "3 templates",
        "PDF export",
        "Email support",
      ],
      highlighted: false,
      originalPrice: undefined,
      savings: undefined,
    },
    {
      name: "Professional",
      price: 90,
      period: "year",
      originalPrice: 108,
      description: "Best for freelancers",
      features: [
        "Unlimited invoices",
        "20+ premium templates",
        "Cloud storage",
        "Email delivery",
        "Payment tracking",
        "Priority support",
      ],
      highlighted: true,
      savings: "Save $18",
    },
    {
      name: "Enterprise",
      price: 290,
      period: "year",
      originalPrice: 348,
      description: "For growing teams",
      features: [
        "Everything in Pro",
        "10 team members",
        "API access",
        "Custom branding",
        "Advanced analytics",
        "Dedicated support",
      ],
      highlighted: false,
      savings: "Save $58",
    },
  ],
};

export function PricingToggle() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const plans = pricingData[billingPeriod];

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-12">
        <Tabs
          value={billingPeriod}
          onValueChange={(value) => setBillingPeriod(value as "monthly" | "yearly")}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">Save 17%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.highlighted
                ? "border-indigo-500 shadow-xl ring-2 ring-indigo-500"
                : ""
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-4 py-1">
                  <Zap className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
              </div>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
              <div className="mt-4">
                {plan.originalPrice && (
                  <div className="text-sm text-gray-400 line-through">
                    ${plan.originalPrice}
                  </div>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/{billingPeriod === "monthly" ? "mo" : "yr"}</span>
                </div>
                {plan.savings && (
                  <Badge variant="outline" className="mt-2 border-green-500 text-green-600">
                    {plan.savings}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
                asChild
              >
                <Link href="/create">
                  {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
