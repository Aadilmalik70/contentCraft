
"use server";

import { adaptContentForPlatform, type AdaptContentForPlatformInput, type AdaptContentForPlatformOutput } from "@/ai/flows/adapt-content-for-platform";
import { generateContentDraft, type GenerateContentDraftInput, type GenerateContentDraftOutput } from "@/ai/flows/generate-content-draft";
import { performKeywordResearch, type KeywordResearchInput, type KeywordResearchOutput } from "@/ai/flows/keyword-research-flow";

export async function handleGenerateContentDraft(input: GenerateContentDraftInput): Promise<GenerateContentDraftOutput> {
  try {
    const result = await generateContentDraft(input);
    return result;
  } catch (error) {
    console.error("Error generating content draft:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to generate content draft.");
    }
    throw new Error("Failed to generate content draft. An unknown error occurred.");
  }
}

export async function handleAdaptContentForPlatform(input: AdaptContentForPlatformInput): Promise<AdaptContentForPlatformOutput> {
  try {
    const result = await adaptContentForPlatform(input);
    return result;
  } catch (error) {
    console.error("Error adapting content for platform:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to adapt content for platform.");
    }
    throw new Error("Failed to adapt content for platform. An unknown error occurred.");
  }
}

export async function handlePerformKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  try {
    const result = await performKeywordResearch(input);
    return result;
  } catch (error) {
    console.error("Error performing keyword research:", error);
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to perform keyword research.");
    }
    throw new Error("Failed to perform keyword research. An unknown error occurred.");
  }
}

