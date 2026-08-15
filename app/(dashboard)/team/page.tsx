"use client"

import * as React from "react"
import {
  IconDots,
  IconMail,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const members = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Admin",
    department: "Management",
    status: "active" as const,
    joinedDate: "2023-03-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@company.com",
    role: "Editor",
    department: "Finance",
    status: "active" as const,
    joinedDate: "2023-06-20",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@company.com",
    role: "Viewer",
    department: "Sales",
    status: "active" as const,
    joinedDate: "2023-09-01",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@company.com",
    role: "Editor",
    department: "Operations",
    status: "inactive" as const,
    joinedDate: "2023-01-10",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa@company.com",
    role: "Admin",
    department: "Finance",
    status: "active" as const,
    joinedDate: "2023-04-05",
  },
  {
    id: "6",
    name: "David Brown",
    email: "david@company.com",
    role: "Viewer",
    department: "Sales",
    status: "active" as const,
    joinedDate: "2023-11-12",
  },
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  Editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Viewer: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export default function TeamPage() {
  const activeMembers = members.filter((m) => m.status === "active").length

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Stats */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Members</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {members.length}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    +2
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Team growing <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">2 new members this quarter</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Active Members</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {activeMembers}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    {Math.round((activeMembers / members.length) * 100)}%
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  High activity rate <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">Most members are active</div>
              </CardFooter>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Departments</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {new Set(members.map((m) => m.department)).size}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">Stable</Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Across all departments
                </div>
                <div className="text-muted-foreground">Well distributed team</div>
              </CardFooter>
            </Card>
          </div>

          {/* Team Members Grid */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <Button
                size="sm"
                onClick={() => {
                  window.location.href = "mailto:team@acme.com?subject=Invite%20Member";
                }}
              >
                <IconPlus className="size-4" />
                Invite Member
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <IconMail className="size-3" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDots className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Role</DropdownMenuItem>
                          <DropdownMenuItem>View Activity</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className={roleColors[member.role]} variant="secondary">
                        {member.role}
                      </Badge>
                      <Badge variant="outline">{member.department}</Badge>
                      <Badge variant={member.status === "active" ? "default" : "secondary"}>
                        {member.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}