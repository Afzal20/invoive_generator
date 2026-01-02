"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, X } from "lucide-react";

const features = [
  {
    category: "Invoice Management",
    items: [
      { name: "Monthly invoices", free: "10", pro: "Unlimited", business: "Unlimited" },
      { name: "Templates", free: "3", pro: "20+", business: "20+" },
      { name: "PDF export", free: true, pro: true, business: true },
      { name: "Cloud storage", free: false, pro: true, business: true },
      { name: "Email delivery", free: false, pro: true, business: true },
    ],
  },
  {
    category: "Features",
    items: [
      { name: "Payment tracking", free: false, pro: true, business: true },
      { name: "Custom branding", free: false, pro: true, business: true },
      { name: "Recurring invoices", free: false, pro: true, business: true },
      { name: "Multi-currency", free: false, pro: false, business: true },
      { name: "API access", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Collaboration",
    items: [
      { name: "Team members", free: "1", pro: "1", business: "5" },
      { name: "Client portal", free: false, pro: false, business: true },
      { name: "Role permissions", free: false, pro: false, business: true },
    ],
  },
  {
    category: "Support",
    items: [
      { name: "Email support", free: true, pro: true, business: true },
      { name: "Priority support", free: false, pro: false, business: true },
      { name: "Dedicated manager", free: false, pro: false, business: true },
    ],
  },
];

export function PricingComparison() {
  const renderCell = (value: string | boolean | number) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="h-5 w-5 text-green-500 mx-auto" />
      ) : (
        <X className="h-5 w-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Compare All Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold">Features</th>
                <th className="text-center py-4 px-4 font-semibold">Free</th>
                <th className="text-center py-4 px-4 font-semibold bg-indigo-50">Pro</th>
                <th className="text-center py-4 px-4 font-semibold">Business</th>
              </tr>
            </thead>
            <tbody>
              {features.map((category, categoryIndex) => (
                <React.Fragment key={category.category}>
                  <tr className="bg-gray-50">
                    <td
                      colSpan={4}
                      className="py-3 px-4 font-semibold text-sm text-gray-900"
                    >
                      {category.category}
                    </td>
                  </tr>
                  {category.items.map((item, itemIndex) => (
                    <tr
                      key={`${categoryIndex}-${itemIndex}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderCell(item.free)}
                      </td>
                      <td className="py-3 px-4 text-center bg-indigo-50/50">
                        {renderCell(item.pro)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {renderCell(item.business)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
