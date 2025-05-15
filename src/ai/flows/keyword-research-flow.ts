
'use server';
/**
 * @fileOverview A keyword research AI agent.
 *
 * - performKeywordResearch - A function that handles the keyword research process.
 * - KeywordResearchInput - The input type for the performKeywordResearch function.
 * - KeywordResearchOutput - The return type for the performKeywordResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { KeywordData } from '@/types';

const KeywordResearchInputSchema = z.object({
  prompt: z.string().describe('The research prompt or topic for keywords.'),
});
export type KeywordResearchInput = z.infer<typeof KeywordResearchInputSchema>;

const KeywordDataSchema = z.object({
  id: z.string(),
  keyword: z.string(),
  volume: z.number(),
  difficulty: z.number(),
  cpc: z.number(),
  competition: z.number(),
  relatedTerms: z.array(z.string()),
});

const KeywordResearchOutputSchema = z.array(KeywordDataSchema);
export type KeywordResearchOutput = z.infer<typeof KeywordResearchOutputSchema>;

// This mock function simulates a call to a third-party keyword research API.
// Replace this with actual API calls to your chosen keyword tool.
const fetchKeywordsFromThirdParty = async (prompt: string): Promise<KeywordData[]> => {
  console.log("Mock API call for prompt in Genkit flow:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseKeywords: KeywordData[] = [
        { id: "1", keyword: "ai content marketing", volume: 15000, difficulty: 45, cpc: 2.5, competition: 0.6, relatedTerms: ["content automation", "ai writing tools"] },
        { id: "2", keyword: "seo keyword strategy", volume: 12000, difficulty: 60, cpc: 3.1, competition: 0.8, relatedTerms: ["long-tail keywords", "topic clusters"] },
        { id: "3", keyword: "social media analytics", volume: 8000, difficulty: 30, cpc: 1.8, competition: 0.4, relatedTerms: ["engagement tracking", "influencer marketing"] },
        { id: "4", keyword: "email marketing automation", volume: 10000, difficulty: 50, cpc: 2.2, competition: 0.7, relatedTerms: ["drip campaigns", "lead nurturing"] },
        { id: "5", keyword: "contentcraft ai features", volume: 500, difficulty: 10, cpc: 0.5, competition: 0.1, relatedTerms: ["ai copilot", "marketing platform"] },
        { id: "6", keyword: "best marketing tools 2024", volume: 18000, difficulty: 70, cpc: 4.0, competition: 0.9, relatedTerms: ["crm software", "analytics platforms"] },
        { id: "7", keyword: "how to increase website traffic", volume: 22000, difficulty: 65, cpc: 2.8, competition: 0.85, relatedTerms: ["organic search", "link building"] },
      ];
      // Simulate some variation based on prompt
      const searchTerm = prompt.toLowerCase().split(" ")[0] || "ai";
      const filtered = baseKeywords.filter(k => k.keyword.toLowerCase().includes(searchTerm));
      resolve(filtered.length > 0 ? filtered : baseKeywords.slice(0, Math.max(1, Math.floor(Math.random() * baseKeywords.length)) ));
    }, 1000); // Reduced timeout for snappier feel
  });
};


export async function performKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  return keywordResearchFlow(input);
}

const keywordResearchFlow = ai.defineFlow(
  {
    name: 'keywordResearchFlow',
    inputSchema: KeywordResearchInputSchema,
    outputSchema: KeywordResearchOutputSchema,
  },
  async (input) => {
    // In a real scenario, you would call your third-party API here.
    // For example: const keywords = await someKeywordToolAPI(input.prompt, { location: input.location, language: input.language });
    const keywords = await fetchKeywordsFromThirdParty(input.prompt);
    
    // Ensure the output matches the schema
    return keywords.map(kw => KeywordDataSchema.parse(kw));
  }
);
