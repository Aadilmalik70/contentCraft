
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleAdaptContentForPlatform } from "@/lib/actions";
import type { AdaptContentForPlatformInput } from "@/ai/flows/adapt-content-for-platform";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const platformOptions = ["Social Media Post", "Email Newsletter", "X/Twitter Thread", "Blog Summary"] as const;

const formSchema = z.object({
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  platform: z.enum(platformOptions),
  brandVoice: z.string().optional(),
});

type ContentAdaptationFormValues = z.infer<typeof formSchema>;

export default function ContentAdaptationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [adaptedContent, setAdaptedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ContentAdaptationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      platform: "Social Media Post",
      brandVoice: "",
    },
  });

  async function onSubmit(values: ContentAdaptationFormValues) {
    setIsLoading(true);
    setAdaptedContent(null);
    try {
      const input: AdaptContentForPlatformInput = {
        content: values.content,
        platform: values.platform,
        ...(values.brandVoice && { brandVoice: values.brandVoice }),
      };
      const result = await handleAdaptContentForPlatform(input);
      setAdaptedContent(result.adaptedContent);
      toast({
        title: "Content Adapted",
        description: "Your content has been successfully adapted for the selected platform.",
      });
    } catch (error) {
      console.error("Content adaptation error:", error);
      toast({
        title: "Error",
        description: "Failed to adapt content. Please try again.",
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
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your existing content here..."
                    className="resize-y min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Choose the platform you want to adapt the content for.</FormDescription>
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
                <FormDescription>Define the tone and style for the adapted content.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shuffle className="mr-2 h-4 w-4" />
            )}
            Adapt Content
          </Button>
        </form>
      </Form>

      {adaptedContent && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle>Adapted Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={adaptedContent} readOnly className="min-h-[200px] bg-muted/30 resize-y" />
             <Button variant="outline" className="mt-4" onClick={() => navigator.clipboard.writeText(adaptedContent)}>
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
