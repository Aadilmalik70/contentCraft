
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Search, MessageSquare, BookOpen } from "lucide-react";

const faqs = [
  {
    question: "How do I generate content with a specific brand voice?",
    answer: "In the Content Generation tool, there's an optional 'Brand Voice' field. You can input descriptions of your brand's tone, style, and key messaging points (e.g., 'professional and informative', 'witty and engaging with a focus on sustainability'). The AI will use this to tailor the generated content."
  },
  {
    question: "Can I integrate ContentCraft AI with my existing SEO tools?",
    answer: "Yes, ContentCraft AI is designed to integrate with major SEO data providers like Ahrefs and Semrush. You can manage these integrations in the Settings > API & Integrations section. This allows the platform to pull real-time keyword data and competitor insights."
  },
  {
    question: "How does team collaboration work?",
    answer: "Team members can be invited to your organization and assigned to specific teams or workspaces. Within a workspace, all team members can view, edit, and comment on content plans, keyword lists, and generated drafts, depending on their assigned roles (Admin, Editor, Viewer)."
  },
  {
    question: "What kind of data analysis dashboards are available?",
    answer: "The dashboards provide insights into key SEO opportunities (low competition, high volume keywords), potential traffic estimations based on keyword performance, keyword difficulty breakdowns, and an overview of competitor content strategies for your target keywords."
  },
  {
    question: "How is my data secured?",
    answer: "We prioritize data security. All user data is stored securely in Firestore with strict security rules. API keys for external tools are managed using Google Secret Manager, ensuring they are not exposed directly in the application code. We also recommend enabling Two-Factor Authentication for your account."
  }
];

export default function SupportPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <LifeBuoy className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Support Center</h1>
        <p className="mt-2 text-lg text-muted-foreground">We&apos;re here to help you get the most out of ContentCraft AI.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center"><Search className="mr-2 h-6 w-6 text-primary" /> Frequently Asked Questions</CardTitle>
          <CardDescription>Find answers to common questions about ContentCraft AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input type="search" placeholder="Search FAQs..." className="mb-6" />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><BookOpen className="mr-2 h-6 w-6 text-primary" /> Knowledge Base</CardTitle>
            <CardDescription>Explore our comprehensive guides and tutorials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">Dive deep into features, best practices, and step-by-step instructions to master ContentCraft AI.</p>
            <Button variant="outline" className="w-full">Browse Articles</Button>
            <ul className="list-disc list-inside text-sm text-primary space-y-1 pl-2">
                <li><a href="#" className="hover:underline">Getting Started with Content Generation</a></li>
                <li><a href="#" className="hover:underline">Understanding Keyword Research Metrics</a></li>
                <li><a href="#" className="hover:underline">Setting Up Your Team and Workspaces</a></li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary" /> Contact Support</CardTitle>
            <CardDescription>Can&apos;t find an answer? Reach out to our support team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div>
                <Label htmlFor="supportSubject">Subject</Label>
                <Input id="supportSubject" placeholder="e.g., Issue with content adaptation" />
              </div>
              <div>
                <Label htmlFor="supportMessage">Message</Label>
                <Textarea id="supportMessage" placeholder="Describe your issue or question in detail..." className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
            <p className="text-xs text-muted-foreground text-center">Our team typically responds within 24 hours.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
