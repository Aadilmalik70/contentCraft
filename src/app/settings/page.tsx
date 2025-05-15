
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserCircle, Bell, Lock, Palette, Briefcase, FileText } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><UserCircle className="mr-2 h-5 w-5 text-primary" /> Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="Current User Name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="user@example.com" disabled />
              </div>
              <Button className="w-full">Update Profile</Button>
            </CardContent>
          </Card>
           <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button variant="outline" className="w-full">Change Password</Button>
               <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="2fa" className="flex flex-col space-y-1">
                  <span>Two-Factor Authentication</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Add an extra layer of security to your account.
                  </span>
                </Label>
                <Switch id="2fa" aria-label="Toggle two-factor authentication" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
              <CardDescription>Manage your notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: "emailNews", label: "News and Updates", description: "Receive emails about new features and updates." },
                { id: "taskAlerts", label: "Task Alerts", description: "Get notified when content generation or analysis tasks are complete." },
                { id: "teamMentions", label: "Team Mentions", description: "Receive notifications when you are mentioned by team members." },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <Label htmlFor={item.id} className="flex flex-col space-y-1">
                    <span>{item.label}</span>
                    <span className="font-normal leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  </Label>
                  <Switch id={item.id} defaultChecked={item.id !== "teamMentions"} aria-label={`Toggle ${item.label}`} />
                </div>
              ))}
            </CardContent>
             <CardFooter>
                <Button>Save Notification Preferences</Button>
             </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                  <span>Dark Mode</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Toggle between light and dark themes.
                  </span>
                </Label>
                <Switch id="darkMode" aria-label="Toggle dark mode" />
              </div>
               {/* Add more appearance settings here if needed */}
            </CardContent>
            <CardFooter>
                <Button>Save Appearance Settings</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> API &amp; Integrations</CardTitle>
              <CardDescription>Manage your API keys and third-party tool integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Your API Key: <code className="bg-muted p-1 rounded-sm text-sm">********-****-****-****-************</code></p>
              <Button variant="outline">Generate New API Key</Button>
              <Separator />
              <p className="font-medium">Connected Tools:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Ahrefs (Connected) - <Button variant="link" size="sm" className="p-0 h-auto text-destructive">Disconnect</Button></li>
                <li>Semrush (Not Connected) - <Button variant="link" size="sm" className="p-0 h-auto">Connect</Button></li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button>Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
