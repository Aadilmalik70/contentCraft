
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handleGenerateContentDraft } from "@/lib/actions";
import type { GenerateContentDraftInput } from "@/ai/flows/generate-content-draft";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  keywords: z.string().min(3, { message: "Keywords must be at least 3 characters." }),
  contentBrief: z.string().min(10, { message: "Content brief must be at least 10 characters." }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters." }),
  brandVoice: z.string().optional(),
});

type ContentGenerationFormValues = z.infer<typeof formSchema>;

export default function ContentGenerationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ContentGenerationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      contentBrief: "",
      requirements: "",
      brandVoice: "",
    },
  });

  async function onSubmit(values: ContentGenerationFormValues) {
    setIsLoading(true);
    setGeneratedContent(null);
    try {
      const input: GenerateContentDraftInput = {
        keywords: values.keywords,
        contentBrief: values.contentBrief,
        requirements: values.requirements,
        ...(values.brandVoice && { brandVoice: values.brandVoice }),
      };
      const result = await handleGenerateContentDraft(input);
      setGeneratedContent(result.contentDraft);
      toast({
        title: "Content Generated",
        description: "Your content draft has been successfully generated.",
      });
    } catch (error) {
      console.error("Content generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AI marketing, content strategy" {...field} />
                </FormControl>
                <FormDescription>Enter comma-separated keywords for your content.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentBrief"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content Brief</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the main topic, target audience, and goals of the content."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specific Requirements</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Include 3 sections, mention specific product, desired length."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brandVoice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Voice (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Professional and informative, witty and engaging" {...field} />
                </FormControl>
                <FormDescription>Define the tone and style for the generated content.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Content
          </Button>
        </form>
      </Form>

      {generatedContent && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle>Generated Content Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedContent} readOnly className="min-h-[300px] bg-muted/30 resize-y" />
            <Button variant="outline" className="mt-4" onClick={() => navigator.clipboard.writeText(generatedContent)}>
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
