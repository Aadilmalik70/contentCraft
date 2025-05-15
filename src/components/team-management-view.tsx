
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Trash2, Edit3, Users, Briefcase, Settings2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const mockTeams = [
  { id: "1", name: "Marketing Wizards", members: 5, projects: 3, created: "2023-01-15" },
  { id: "2", name: "Content Creators", members: 3, projects: 7, created: "2023-03-22" },
  { id: "3", name: "SEO Strategists", members: 4, projects: 2, created: "2023-05-10" },
];

const mockUsers = [
    { id: "u1", name: "Alice Wonderland", email: "alice@example.com", role: "Admin", team: "Marketing Wizards", avatar: "https://placehold.co/40x40.png?text=AW" },
    { id: "u2", name: "Bob The Builder", email: "bob@example.com", role: "Editor", team: "Content Creators", avatar: "https://placehold.co/40x40.png?text=BB" },
    { id: "u3", name: "Charlie Chaplin", email: "charlie@example.com", role: "Viewer", team: "Marketing Wizards", avatar: "https://placehold.co/40x40.png?text=CC" },
    { id: "u4", name: "Diana Prince", email: "diana@example.com", role: "Editor", team: "SEO Strategists", avatar: "https://placehold.co/40x40.png?text=DP" },
];


export default function TeamManagementView() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Manage Teams</CardTitle>
            <CardDescription>Create, edit, and manage your teams.</CardDescription>
          </div>
          <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Create New Team</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.members}</TableCell>
                  <TableCell>{team.projects}</TableCell>
                  <TableCell>{team.created}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" />
                      <span className="sr-only">Edit Team</span>
                    </Button>
                    <Button variant="destructive" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete Team</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-xl flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Workspace Organization</CardTitle>
                <CardDescription>Organize your projects and content within workspaces.</CardDescription>
            </div>
             <Button size="sm" variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> New Workspace</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Workspaces allow teams to collaborate on specific projects, campaigns, or clients. 
            Each workspace can have its own set of keyword lists, content plans, and generated drafts.
          </p>
          {/* Placeholder for workspace list or creation form */}
          <div className="mt-4 p-6 border rounded-lg bg-secondary/30 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No workspaces yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create a workspace to get started.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> User Management</CardTitle>
            <CardDescription>Invite and manage users in your organization.</CardDescription>
          </div>
           <Button size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Invite User</Button>
        </CardHeader>
        <CardContent>
            <div className="mb-4">
                <Input placeholder="Search users by name or email..." />
            </div>
             <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                <AvatarFallback>{user.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Select defaultValue={user.role.toLowerCase()}>
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{user.team || "N/A"}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                        <Settings2 className="h-4 w-4" />
                        <span className="sr-only">Manage User</span>
                        </Button>
                         <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove User</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
