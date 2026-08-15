import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateClientPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Create Client</h2>
                <p className="text-sm text-muted-foreground">
                  Add the client information for future invoices.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link href="/clients">Back to Clients</Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
                <CardDescription>
                  Fill in the business and contact information.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="client-name">Client name</Label>
                  <Input id="client-name" placeholder="Acme Corp" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input id="client-email" type="email" placeholder="billing@acme.com" />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="client-address">Address</Label>
                  <Input id="client-address" placeholder="123 Business St, City, State" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input id="client-phone" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client-notes">Notes</Label>
                  <Input id="client-notes" placeholder="Preferred payment terms" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
