'use server';

/**
 * @fileOverview A content draft generation AI agent.
 *
 * - generateContentDraft - A function that handles the content draft generation process.
 * - GenerateContentDraftInput - The input type for the generateContentDraft function.
 * - GenerateContentDraftOutput - The return type for the generateContentDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentDraftInputSchema = z.object({
  keywords: z
    .string()
    .describe('The keywords to be used for content generation.'),
  contentBrief: z.string().describe('The content brief for the content.'),
  requirements: z.string().describe('The specific requirements for the content.'),
  brandVoice: z.string().optional().describe('The brand voice to be applied to the content.'),
});
export type GenerateContentDraftInput = z.infer<typeof GenerateContentDraftInputSchema>;

const GenerateContentDraftOutputSchema = z.object({
  contentDraft: z.string().describe('The generated content draft.'),
});

export type GenerateContentDraftOutput = z.infer<typeof GenerateContentDraftOutputSchema>;

export async function generateContentDraft(input: GenerateContentDraftInput): Promise<GenerateContentDraftOutput> {
  return generateContentDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentDraftPrompt',
  input: {schema: GenerateContentDraftInputSchema},
  output: {schema: GenerateContentDraftOutputSchema},
  prompt: `You are an expert content writer specializing in creating SEO-optimized content.

You will use the following information to generate a content draft based on the user's requirements.

Keywords: {{{keywords}}}
Content Brief: {{{contentBrief}}}
Requirements: {{{requirements}}}

{{#if brandVoice}}
Brand Voice: {{{brandVoice}}}
{{/if}}

Please generate a content draft that is well-structured and includes elements relevant for search optimization (e.g., headings, potential keyword usage).`,
});

const generateContentDraftFlow = ai.defineFlow(
  {
    name: 'generateContentDraftFlow',
    inputSchema: GenerateContentDraftInputSchema,
    outputSchema: GenerateContentDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
