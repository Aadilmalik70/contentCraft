
"use server";

import { adaptContentForPlatform, type AdaptContentForPlatformInput, type AdaptContentForPlatformOutput } from "@/ai/flows/adapt-content-for-platform";
import { generateContentDraft, type GenerateContentDraftInput, type GenerateContentDraftOutput } from "@/ai/flows/generate-content-draft";

export async function handleGenerateContentDraft(input: GenerateContentDraftInput): Promise<GenerateContentDraftOutput> {
  try {
    const result = await generateContentDraft(input);
    return result;
  } catch (error) {
    console.error("Error generating content draft:", error);
    // It's better to throw a custom error or return an error object
    // For simplicity, re-throwing. Client should handle this.
    throw new Error("Failed to generate content draft.");
  }
}

export async function handleAdaptContentForPlatform(input: AdaptContentForPlatformInput): Promise<AdaptContentForPlatformOutput> {
  try {
    const result = await adaptContentForPlatform(input);
    return result;
  } catch (error) {
    console.error("Error adapting content for platform:", error);
    throw new Error("Failed to adapt content for platform.");
  }
}
