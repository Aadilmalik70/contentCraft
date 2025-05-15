// AdaptContentForPlatform.ts
'use server';

/**
 * @fileOverview Adapts existing content for different platforms using AI.
 *
 * - adaptContentForPlatform - A function that adapts content for a specific platform.
 * - AdaptContentForPlatformInput - The input type for the adaptContentForPlatform function.
 * - AdaptContentForPlatformOutput - The return type for the adaptContentForPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptContentForPlatformInputSchema = z.object({
  content: z.string().describe('The content to be adapted.'),
  platform: z.string().describe('The target platform (e.g., social media, email, X/Twitter).'),
  brandVoice: z.string().optional().describe('Optional brand voice or tone profile to apply.'),
});

export type AdaptContentForPlatformInput = z.infer<typeof AdaptContentForPlatformInputSchema>;

const AdaptContentForPlatformOutputSchema = z.object({
  adaptedContent: z.string().describe('The content adapted for the specified platform.'),
});

export type AdaptContentForPlatformOutput = z.infer<typeof AdaptContentForPlatformOutputSchema>;

export async function adaptContentForPlatform(input: AdaptContentForPlatformInput): Promise<AdaptContentForPlatformOutput> {
  return adaptContentForPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptContentForPlatformPrompt',
  input: {schema: AdaptContentForPlatformInputSchema},
  output: {schema: AdaptContentForPlatformOutputSchema},
  prompt: `You are an AI assistant specializing in adapting content for different platforms.

  Adapt the following content for the {{platform}} platform. Consider the platform's specific constraints and best practices.  If a brand voice is provided, maintain consistent tone.

  Content: {{{content}}}

  Platform: {{{platform}}}

  Brand Voice: {{#if brandVoice}}{{{brandVoice}}}{{else}}Maintain a neutral tone.{{/if}}
  `,
});

const adaptContentForPlatformFlow = ai.defineFlow(
  {
    name: 'adaptContentForPlatformFlow',
    inputSchema: AdaptContentForPlatformInputSchema,
    outputSchema: AdaptContentForPlatformOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
