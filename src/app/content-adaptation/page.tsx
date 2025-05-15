
import ContentAdaptationForm from "@/components/content-adaptation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentAdaptationPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Content Adaptation</CardTitle>
          <CardDescription>
            Adapt your existing content for different platforms. Specify the target platform and an optional brand voice.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentAdaptationForm />
        </CardContent>
      </Card>
    </div>
  );
}
