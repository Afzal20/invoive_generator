import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Create Invoice</h2>
                <p className="text-sm text-muted-foreground">
                  Start a new invoice from here.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/invoices">Back to Invoices</Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>New Invoice</CardTitle>
                <CardDescription>
                  Use the full creator flow to build an invoice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The invoice editor is also available at the public create page.
                </p>
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/create">Open Invoice Builder</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
