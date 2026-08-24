"use server";

import {
  AiUnavailableError,
  chatCompletion,
  extractJsonArray,
} from "@/lib/ai/openrouter";
import { requireOrg, requireRole } from "@/lib/erp/org";
import { getReportData } from "@/lib/erp/queries";

export interface GeneratedItem {
  description: string;
  quantity: number;
  rate: number;
}

interface GenerateResult {
  ok: boolean;
  error?: string;
  items?: GeneratedItem[];
}

/**
 * AI invoice line-item generator.
 * Turns a plain-language description into structured line items.
 * Editors and above.
 */
export async function generateInvoiceItems(
  prompt: string,
  currency: string,
): Promise<GenerateResult> {
  try {
    await requireRole("editor");
    const trimmed = prompt.trim();
    if (trimmed.length < 4)
      return { ok: false, error: "Describe what you'd like to bill." };
    if (trimmed.length > 600)
      return { ok: false, error: "Please keep the description under 600 characters." };

    const answer = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You convert plain-language billing descriptions into invoice line items. " +
            "Return ONLY a JSON array, no prose. Each element: " +
            '{"description": string (clear client-facing line item name), "quantity": number, "rate": number (unit price in ' +
            currency +
            ")}. " +
            "Infer reasonable quantities/rates when not stated (typical market rates). Use at most 8 items.",
        },
        { role: "user", content: trimmed },
      ],
      { json: true },
    );

    const items = extractJsonArray<GeneratedItem>(answer);
    if (!items || items.length === 0)
      return { ok: false, error: "The AI returned something unexpected. Try rephrasing." };

    const clean = items
      .filter(
        (it) =>
          typeof it.description === "string" &&
          it.description.trim() !== "" &&
          Number(it.quantity) > 0 &&
          Number.isFinite(Number(it.rate)),
      )
      .slice(0, 10)
      .map((it) => ({
        description: it.description.trim().slice(0, 200),
        quantity: Number(it.quantity),
        rate: Number(it.rate),
      }));

    if (clean.length === 0)
      return { ok: false, error: "No usable line items were generated." };

    return { ok: true, items: clean };
  } catch (err) {
    if (err instanceof AiUnavailableError) return { ok: false, error: err.message };
    return { ok: false, error: err instanceof Error ? err.message : "AI request failed." };
  }
}

interface AskResult {
  ok: boolean;
  error?: string;
  answer?: string;
}

/**
 * Ask BizPilot — answers business questions using the org's live report data.
 * Any org member (including viewers).
 */
export async function askBizPilot(question: string): Promise<AskResult> {
  try {
    const ctx = await requireOrg();
    const trimmed = question.trim();
    if (!trimmed) return { ok: false, error: "Ask a question first." };
    if (trimmed.length > 500)
      return { ok: false, error: "Keep questions under 500 characters." };

    const data = await getReportData(ctx.org.id);

    const context = {
      organization: ctx.org.name,
      currency: ctx.org.default_currency || "USD",
      totals: data.totals,
      monthly_last_6_months: data.monthly_series.slice(-6),
      expense_by_category: data.expense_by_category.slice(0, 8),
      top_clients: data.top_clients,
    };

    const answer = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You are BizPilot, a sharp small-business analyst. Answer questions about THIS business using only the JSON data provided. " +
            "Be concise (max 150 words), specific with numbers, and practical. If the data can't answer the question, say so briefly. " +
            "Do not invent numbers.\n\nDATA:\n" +
            JSON.stringify(context),
        },
        { role: "user", content: trimmed },
      ],
      { maxTokens: 600 },
    );

    return { ok: true, answer };
  } catch (err) {
    if (err instanceof AiUnavailableError) return { ok: false, error: err.message };
    return { ok: false, error: err instanceof Error ? err.message : "AI request failed." };
  }
}
