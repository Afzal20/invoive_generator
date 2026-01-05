"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import type { InvoiceData } from "@/lib/invoice";
import { InvoicePDF } from "./InvoicePDF";

type Props = {
  data: InvoiceData;
  className?: string;
  label?: string;
};

export function DownloadInvoicePDF({ data, className, label = "Download PDF" }: Props) {
  const fileName = `${data.invoiceNumber || "invoice"}.pdf`;
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={data} />}
      fileName={fileName}
      className={
        className ||
        "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-shadow shadow"
      }
    >
      {({ loading }) => (
        <span className="inline-flex items-center">
          <Download className="w-4 h-4 mr-2" />
          {loading ? "Preparing PDF..." : label}
        </span>
      )}
    </PDFDownloadLink>
  );
}
