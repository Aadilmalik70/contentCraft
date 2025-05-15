
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit3, Mail, Phone, MapPin, Briefcase } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
            <AvatarImage src="https://placehold.co/128x128.png" alt="User Name" data-ai-hint="user portrait" />
            <AvatarFallback className="text-4xl">UN</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold">User Name</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">Content Strategist @ Company Inc.</CardDescription>
          <Button variant="outline" size="sm" className="mt-4">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>user@example.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>+1 (555) 123-4567 (Not Set)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>San Francisco, CA (Not Set)</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-xl font-semibold mb-3">Professional Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Briefcase className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Team: Marketing Wizards</span>
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio">Short Bio</Label>
                <Input id="bio" defaultValue="Passionate about creating impactful content and leveraging AI for marketing success." readOnly className="bg-muted/30" />
              </div>
            </div>
          </div>
          <Separator />
           <div>
            <h3 className="text-xl font-semibold mb-3">Account Details</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Member since: January 1, 2024</p>
              <p className="text-sm text-muted-foreground">Subscription Plan: Pro Tier</p>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
