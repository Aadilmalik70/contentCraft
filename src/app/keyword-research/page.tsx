
import KeywordResearchView from "@/components/keyword-research-view";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function KeywordResearchPage() {
  return (
    <div className="container mx-auto py-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Keyword Research</CardTitle>
          <CardDescription>
            Enter a prompt to discover relevant keywords. Results include search volume, difficulty, and related terms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KeywordResearchView />
        </CardContent>
      </Card>
    </div>
  );
}
