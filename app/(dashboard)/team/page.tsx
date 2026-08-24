import { TeamView } from "@/components/erp/team-view";
import { getProfile, getTeamData } from "@/lib/erp/queries";

export default async function TeamPage() {
  const [team, profile] = await Promise.all([getTeamData(), getProfile()]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h2 className="text-2xl font-bold">My Team</h2>
            <p className="text-sm text-muted-foreground">
              Invite colleagues and control who can do what.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <TeamView
              organization={team.organization}
              members={team.members}
              profile={profile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
