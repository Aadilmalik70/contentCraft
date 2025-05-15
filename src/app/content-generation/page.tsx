
import ContentGenerationForm from "@/components/content-generation-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContentGenerationPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">AI Content Generation</CardTitle>
          <CardDescription>
            Create compelling content drafts based on your keywords, brief, and requirements.
            Define a brand voice to ensure consistency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContentGenerationForm />
        </CardContent>
      </Card>
    </div>
  );
}
