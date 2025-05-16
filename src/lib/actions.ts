
"use server";

import { adaptContentForPlatform, type AdaptContentForPlatformInput, type AdaptContentForPlatformOutput } from "@/ai/flows/adapt-content-for-platform";
import { generateContentDraft, type GenerateContentDraftInput, type GenerateContentDraftOutput } from "@/ai/flows/generate-content-draft";
import { performKeywordResearch, type KeywordResearchInput, type KeywordResearchOutput } from "@/ai/flows/keyword-research-flow";

export async function handleGenerateContentDraft(input: GenerateContentDraftInput): Promise<GenerateContentDraftOutput> {
  try {
    const result = await generateContentDraft(input);
    return result;
  } catch (error: unknown) {
    console.error("Error generating content draft (raw):", error);
    let errorMessage = "Failed to generate content draft. An unknown error occurred.";
    if (error instanceof Error) {
      if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An Error object was thrown without a message. Check server logs.";
        console.error("Caught Error object without a message in handleGenerateContentDraft:", error);
      }
    } else if (typeof error === 'string' && error) {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as { message?: any; error?: any; };
      if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message) {
        errorMessage = errorObj.message;
      } else if (errorObj.error && typeof errorObj.error === 'string' && errorObj.error) {
        errorMessage = errorObj.error;
      } else {
        try {
          const stringifiedError = JSON.stringify(error);
          errorMessage = stringifiedError !== '{}' ? `Non-Error object: ${stringifiedError}` : "Received a non-standard error object.";
        } catch (e) {
          errorMessage = "Received an unstringifiable non-Error object.";
        }
      }
    }
    if (!errorMessage) {
        errorMessage = "An unexpected error occurred, and no message could be extracted. Check server logs.";
    }
    console.error("Propagating error to client from handleGenerateContentDraft with message:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function handleAdaptContentForPlatform(input: AdaptContentForPlatformInput): Promise<AdaptContentForPlatformOutput> {
  try {
    const result = await adaptContentForPlatform(input);
    return result;
  } catch (error: unknown) {
    console.error("Error adapting content for platform (raw):", error);
    let errorMessage = "Failed to adapt content for platform. An unknown error occurred.";
     if (error instanceof Error) {
      if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "An Error object was thrown without a message. Check server logs.";
        console.error("Caught Error object without a message in handleAdaptContentForPlatform:", error);
      }
    } else if (typeof error === 'string' && error) {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as { message?: any; error?: any; };
      if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message) {
        errorMessage = errorObj.message;
      } else if (errorObj.error && typeof errorObj.error === 'string' && errorObj.error) {
        errorMessage = errorObj.error;
      } else {
        try {
          const stringifiedError = JSON.stringify(error);
          errorMessage = stringifiedError !== '{}' ? `Non-Error object: ${stringifiedError}` : "Received a non-standard error object.";
        } catch (e) {
          errorMessage = "Received an unstringifiable non-Error object.";
        }
      }
    }
     if (!errorMessage) {
        errorMessage = "An unexpected error occurred, and no message could be extracted. Check server logs.";
    }
    console.error("Propagating error to client from handleAdaptContentForPlatform with message:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function handlePerformKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  try {
    const result = await performKeywordResearch(input);
    return result;
  } catch (error: unknown) { 
    console.error("Error performing keyword research (raw):", error);

    let errorMessage = "Failed to perform keyword research. An unknown error occurred.";

    if (error instanceof Error) {
      if (error.message) { 
        errorMessage = error.message;
      } else {
        errorMessage = "An Error object was thrown by Google Ads API without a specific message. Please check server logs for details, particularly for issues related to API credentials, permissions, or request limits.";
        console.error("Caught Error object without a message in handlePerformKeywordResearch (likely from Google Ads API):", error);
      }
    } else if (typeof error === 'string' && error) { 
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      const errorObj = error as { message?: any; error?: any; errors?: any[] };
      if (errorObj.message && typeof errorObj.message === 'string' && errorObj.message) {
        errorMessage = errorObj.message;
      } else if (errorObj.error && typeof errorObj.error === 'string' && errorObj.error) {
        errorMessage = errorObj.error;
      } else if (errorObj.errors && Array.isArray(errorObj.errors) && errorObj.errors.length > 0) {
        const firstError = errorObj.errors[0];
        if (firstError && firstError.message && typeof firstError.message === 'string' && firstError.message) {
          errorMessage = `Google Ads API Error: ${firstError.message}`;
        } else if (firstError && typeof firstError === 'string' && firstError) {
          errorMessage = `Google Ads API Error: ${firstError}`;
        } else {
           errorMessage = "Received a complex error object from Google Ads API. Check server logs for details like 'UNAUTHENTICATED', 'PERMISSION_DENIED', or specific field violations.";
        }
      } else {
        try {
          const stringifiedError = JSON.stringify(error);
          if (stringifiedError !== '{}' && stringifiedError !== 'null') { 
             errorMessage = `A non-standard error object was received: ${stringifiedError}. Check server logs.`;
          } else {
             errorMessage = "Received a non-standard or empty error object. Please verify Google Ads API credentials, permissions, and ensure the account is active and correctly linked. Check server logs for more specific gRPC or API error codes.";
          }
        } catch (e) {
          errorMessage = "Received an unstringifiable non-Error object. This often points to a severe issue with API communication. Check server logs and network configuration.";
        }
      }
    }
    
    if (!errorMessage) {
        errorMessage = "An critical unexpected error occurred in keyword research, and no message could be extracted. Check server logs immediately.";
    }
    console.error("Propagating error to client from handlePerformKeywordResearch with message:", errorMessage);
    throw new Error(errorMessage);
  }
}
