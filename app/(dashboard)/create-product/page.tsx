import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateProductPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Create Product</h2>
                <p className="text-sm text-muted-foreground">
                  Add a product or service to your catalog.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/products">Back to Products</Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>New Product</CardTitle>
                <CardDescription>
                  Add product details for faster invoice creation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Product management is currently available through the product catalog page and the invoice builder flow.
                </p>
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/products">Open Products</Link>
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
