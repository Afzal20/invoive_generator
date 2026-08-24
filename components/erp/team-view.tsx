"use client";

import * as React from "react";
import {
  IconBuildingStore,
  IconDots,
  IconMail,
  IconPlus,
  IconShieldCheck,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Organization, Profile, TeamMember, TeamRole } from "@/lib/erp/types";
import { formatDate, getInitials } from "@/lib/erp/format";
import {
  inviteTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
} from "@/app/(dashboard)/actions";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  viewer: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function TeamView({
  organization,
  members,
  profile,
}: {
  organization: Organization | null;
  members: TeamMember[];
  profile: Profile | null;
}) {
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const pendingCount = members.filter((m) => m.status === "inactive").length;

  async function run(memberId: string, fn: () => Promise<{ ok: boolean; error?: string }>, msg: string) {
    setBusyId(memberId);
    try {
      const res = await fn();
      if (!res.ok) toast.error(res.error ?? "Something went wrong.");
      else toast.success(msg);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Organization</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {organization?.name || profile?.company_name || "My Business"}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconBuildingStore className="size-4" />
              Owned by you
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Members</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {members.length + 1}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconUsers className="size-4" />
              {pendingCount > 0
                ? `${pendingCount} pending invitation${pendingCount === 1 ? "" : "s"}`
                : "Everyone has accepted"}
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Roles</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {new Set(members.map((m) => m.role)).size + 1}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Admins manage everything, editors create, viewers read-only.
          </CardFooter>
        </Card>
      </div>

      {/* Owner card */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Owner</h2>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-sm text-primary">
                  {getInitials(profile?.full_name || "Me")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile?.full_name || "You"}</p>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconMail className="size-3" />
                  {profile?.company_email || "Add email in Settings"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={roleColors.admin} variant="secondary">
                <IconShieldCheck className="size-3" />
                Owner
              </Badge>
              <Badge variant="outline" className="capitalize">
                active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <IconPlus className="size-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <InviteForm
                onDone={() => {
                  setInviteOpen(false);
                  toast.success("Invitation saved.");
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
              <IconUsers className="size-8 text-muted-foreground" />
              <p className="font-medium">No team members yet</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Invite colleagues to help manage invoices, clients, inventory,
                and expenses.
              </p>
              <Button size="sm" className="mt-2" onClick={() => setInviteOpen(true)}>
                <IconPlus className="size-4" />
                Invite your first member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
                          <IconMail className="size-3 shrink-0" />
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          disabled={busyId === member.id}
                        >
                          <IconDots className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change role</DropdownMenuLabel>
                        {(["admin", "editor", "viewer"] as TeamRole[]).map((r) => (
                          <DropdownMenuItem
                            key={r}
                            disabled={r === member.role}
                            onClick={() =>
                              run(
                                member.id,
                                () => updateTeamMemberRole(member.id, r),
                                `Role updated.`,
                              )
                            }
                            className="capitalize"
                          >
                            {r}
                            {r === member.role ? " ✓" : ""}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() =>
                            run(
                              member.id,
                              () => removeTeamMember(member.id),
                              "Member removed.",
                            )
                          }
                        >
                          <IconTrash className="size-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge className={roleColors[member.role]} variant="secondary">
                      {member.role}
                    </Badge>
                    {member.department && (
                      <Badge variant="outline">{member.department}</Badge>
                    )}
                    <Badge
                      variant={member.status === "active" ? "default" : "secondary"}
                      className={
                        member.status === "active"
                          ? ""
                          : "border-dashed text-muted-foreground"
                      }
                    >
                      {member.status === "active" ? "Active" : "Invited"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Invited {formatDate(member.invited_at ?? member.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InviteForm({ onDone }: { onDone: () => void }) {
  const [saving, setSaving] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await inviteTeamMember(fd);
      if (!result.ok) {
        toast.error(result.error ?? "Failed to send invite.");
        return;
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Invite Team Member</DialogTitle>
        <DialogDescription>
          They&apos;ll be added to your organization. You can change their role
          anytime.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="member_name">Name</Label>
          <Input id="member_name" name="name" placeholder="Sarah Johnson" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="member_email">Email</Label>
          <Input
            id="member_email"
            name="email"
            type="email"
            placeholder="sarah@company.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="member_role">Role</Label>
            <Select name="role" defaultValue="viewer">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="member_department">Department</Label>
            <Input
              id="member_department"
              name="department"
              placeholder="Sales"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={saving}>
          {saving ? "Sending..." : "Send Invite"}
        </Button>
      </DialogFooter>
    </form>
  );
}
