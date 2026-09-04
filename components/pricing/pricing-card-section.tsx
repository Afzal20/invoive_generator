"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Check, Sparkles, Sprout } from "lucide-react";
import { UpgradeButton } from "@/components/erp/upgrade-button";
import { BillingPortalButton } from "@/components/erp/billing-portal-button";

interface PricingCardSectionProps {
  inDashboard?: boolean;
  currentPlan?: string;
  isSubscribed?: boolean;
  activeInterval?: "month" | "year";
}

export function PricingCardSection({
  inDashboard = false,
  currentPlan = "free",
  isSubscribed = false,
  activeInterval = "month",
}: PricingCardSectionProps) {
  const proMonthlyPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
    process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ||
    "price_1UBHQXLoTyOsviCM13Zaocz1";

  const proYearlyPriceId =
    process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID ||
    process.env.STRIPE_PRO_YEARLY_PRICE_ID ||
    "price_1UBHQeLoTyOsviCMGed4mMyp";

  return (
    <div className="w-full py-12 px-4">
      {/* Header section matching the design */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase mb-3">
          PRICING
        </p>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Choose the right plan for you
        </h2>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl mx-auto">
          Find the ideal plan that fits your budget and goals. Make informed choices with ease.
        </p>
      </div>

      {/* 3-card pricing grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
        {/* Left Card: Standard / Starter */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[28px] p-8 lg:p-9 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            {/* Round Icon */}
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-6">
              <Sprout className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Pill Badge */}
            <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit mb-5">
              STANDARD
            </div>

            {/* Price */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                0
              </span>
              <span className="text-xs text-neutral-400 ml-2 font-medium">
                / month
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed min-h-[44px]">
              Great for startups and personal projects with a clean and simple design.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>10 Invoices & Estimates / mo</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>5 Clients & 10 Products</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Color Palette</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>File Formats: PDF, PNG, Print</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {inDashboard ? (
              <button
                type="button"
                disabled
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 cursor-default"
              >
                {!isSubscribed ? "Current Plan" : "Free Plan"}
              </button>
            ) : (
              <Link
                href="/create"
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Center Card (Dark Featured Card): Professional Monthly */}
        <div className="bg-[#18181b] text-white rounded-[28px] p-8 lg:p-9 flex flex-col justify-between shadow-2xl relative lg:-translate-y-3 lg:py-11 border border-neutral-800 transition-all duration-300 z-10">
          <div>
            {/* Round Icon */}
            <div className="w-12 h-12 rounded-full bg-white text-neutral-950 flex items-center justify-center mb-6 shadow-sm">
              <Boxes className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Pill Badge */}
            <div className="bg-white text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit mb-5">
              PROFESSIONAL MONTHLY
            </div>

            {/* Price */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                9
              </span>
              <span className="text-xs text-neutral-400 ml-2 font-medium">
                / month
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-300 mb-8 leading-relaxed min-h-[44px]">
              The comprehensive solution for businesses looking for full invoicing power with all essential assets included.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Unlimited Invoices & Estimates</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Unlimited Clients & Products</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Color Palette & Branding</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>File Formats: PDF, CSV, Print</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Up to 10 Team Members</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-200 font-medium">
                <div className="w-5 h-5 rounded-full bg-white text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Recurring Invoices & Reminders</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {inDashboard && isSubscribed && activeInterval === "month" ? (
              <BillingPortalButton />
            ) : inDashboard ? (
              <UpgradeButton
                priceId={proMonthlyPriceId}
                className="w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                label={
                  <span className="flex items-center justify-center gap-2">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                }
              />
            ) : (
              <Link
                href="/settings/billing"
                className="w-full rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Card: Premium Annual */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-[28px] p-8 lg:p-9 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            {/* Round Icon */}
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 stroke-[1.75]" />
            </div>

            {/* Pill Badge */}
            <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-[11px] font-bold tracking-wider uppercase px-3.5 py-1 rounded-full w-fit mb-5">
              PREMIUM ANNUAL
            </div>

            {/* Price */}
            <div className="flex items-baseline mb-3">
              <span className="text-2xl font-semibold text-neutral-900 dark:text-white mr-1 -translate-y-2">
                $
              </span>
              <span className="text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                90
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 ml-2 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed min-h-[44px]">
              For businesses seeking a solid plan with room for refinement, maximum annual savings, and custom branding.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Everything in Pro Monthly</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>2 Months Free ($18 Annual Savings)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Custom Color Palette & Brand Kit</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>File Formats: PDF, CSV, Excel, Print</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Audit Log & Role Permissions</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span>Priority Support & Fast Response</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {inDashboard && isSubscribed && activeInterval === "year" ? (
              <BillingPortalButton />
            ) : inDashboard ? (
              <UpgradeButton
                priceId={proYearlyPriceId}
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                label={
                  <span className="flex items-center justify-center gap-2">
                    Get started
                    <ArrowRight className="w-4 h-4" />
                  </span>
                }
              />
            ) : (
              <Link
                href="/settings/billing"
                className="w-full rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 font-medium py-3.5 px-6 text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
