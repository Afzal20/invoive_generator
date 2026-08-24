import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientAction } from "@/app/(dashboard)/actions"

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

            <form action={createClientAction}>
              <Card>
                <CardHeader>
                  <CardTitle>Client Details</CardTitle>
                  <CardDescription>
                    Fill in the business and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Client name *</Label>
                    <Input id="name" name="name" required placeholder="Acme Corp" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" placeholder="Acme Corporation Ltd." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="billing@acme.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Business St, City, State"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button asChild variant="ghost">
                    <Link href="/clients">Cancel</Link>
                  </Button>
                  <Button type="submit">Save Client</Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}