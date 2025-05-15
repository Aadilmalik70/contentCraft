
import TeamManagementView from "@/components/team-management-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TeamManagementPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
        </div>
        <TeamManagementView />
      </div>
    </div>
  );
}
