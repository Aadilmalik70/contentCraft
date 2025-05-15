
'use server';
/**
 * @fileOverview A keyword research AI agent using Google Keyword Planner.
 *
 * - performKeywordResearch - A function that handles the keyword research process.
 * - KeywordResearchInput - The input type for the performKeywordResearch function.
 * - KeywordResearchOutput - The return type for the performKeywordResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { KeywordData } from '@/types';
import { GoogleAdsApi, enums } from 'google-ads-api';

const KeywordResearchInputSchema = z.object({
  prompt: z.string().describe('The research prompt or seed keywords for Google Keyword Planner (e.g., "ai content marketing", "best travel backpacks").'),
});
export type KeywordResearchInput = z.infer<typeof KeywordResearchInputSchema>;

const KeywordDataSchema = z.object({
  id: z.string().describe("Unique ID for the keyword, typically from the API."),
  keyword: z.string().describe("The keyword text."),
  volume: z.number().describe("Average monthly search volume."),
  difficulty: z.number().describe("SEO difficulty score (0-100). Note: Google Keyword Planner does not provide a direct SEO difficulty score. This will be 0."),
  cpc: z.number().describe("Average Cost Per Click in USD."),
  competition: z.number().describe("Competition level (0-1, where 1 is high). Derived from Keyword Planner's competition index."),
  relatedTerms: z.array(z.string()).describe("List of related keyword terms. Note: This will be empty as it's not directly provided per keyword in this manner by Keyword Planner."),
});

const KeywordResearchOutputSchema = z.array(KeywordDataSchema);
export type KeywordResearchOutput = z.infer<typeof KeywordResearchOutputSchema>;


// IMPORTANT: Ensure you have set up your .env file with Google Ads API credentials.
// GOOGLE_ADS_DEVELOPER_TOKEN
// GOOGLE_ADS_CLIENT_ID
// GOOGLE_ADS_CLIENT_SECRET
// GOOGLE_ADS_REFRESH_TOKEN
// GOOGLE_ADS_LOGIN_CUSTOMER_ID (Your MCC/Manager account ID, if applicable - no dashes)
// GOOGLE_ADS_LINKED_CUSTOMER_ID (The specific Ads Account ID to query - no dashes)

const getGoogleKeywordIdeasTool = ai.defineTool(
  {
    name: 'getGoogleKeywordIdeasTool',
    description: 'Fetches keyword ideas from Google Keyword Planner based on seed keywords and a target language/location.',
    inputSchema: z.object({
      seedKeywords: z.array(z.string()).describe('A list of seed keywords to generate ideas from.'),
      // languageId: z.string().optional().describe("Google Ads API language constant ID, e.g., '1000' for English. Defaults to English."),
      // geoTargetConstantId: z.string().optional().describe("Google Ads API geo target constant ID, e.g., '2840' for United States. Defaults to United States."),
    }),
    outputSchema: KeywordResearchOutputSchema,
  },
  async (input) => {
    if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN ||
        !process.env.GOOGLE_ADS_CLIENT_ID ||
        !process.env.GOOGLE_ADS_CLIENT_SECRET ||
        !process.env.GOOGLE_ADS_REFRESH_TOKEN ||
        !process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID) {
      throw new Error("Google Ads API credentials are not fully configured in .env file.");
    }

    const client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID!, // The account to query
      login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!, // MCC ID if using one
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    const languageId = '1000'; // English. See: https://developers.google.com/google-ads/api/reference/data/codes-formats#languages
    const geoTargetConstantId = '2840'; // United States. See: https://developers.google.com/google-ads/api/reference/data/geotargets

    try {
      const response = await customer.keywordPlanIdeaService.generateKeywordIdeas({
        customer_id: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID!,
        keyword_seed: { keywords: input.seedKeywords },
        language: `languageConstants/${languageId}`,
        geo_target_constants: [`geoTargetConstants/${geoTargetConstantId}`],
        // historical_metrics_options: { // This can refine results but might limit them too
        //   include_average_cpc: true,
        // },
        keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH_AND_PARTNERS,
      });

      const keywords: KeywordData[] = [];
      if (response.results) {
        for (const result of response.results) {
          const metrics = result.keyword_idea_metrics;
          let competitionLevel = 0;
          if (metrics?.competition === enums.KeywordPlanCompetitionLevel.LOW) {
            competitionLevel = 0.25;
          } else if (metrics?.competition === enums.KeywordPlanCompetitionLevel.MEDIUM) {
            competitionLevel = 0.5;
          } else if (metrics?.competition === enums.KeywordPlanCompetitionLevel.HIGH) {
            competitionLevel = 0.75;
          }

          // Ensure metrics values are numbers before performing arithmetic operations or toFixed
          const avgMonthlySearches = Number(metrics?.avg_monthly_searches) || 0;
          const cpcMicros = Number(metrics?.average_cpc_micros) || 0;
          // const lowTopOfPageBidMicros = Number(metrics?.low_top_of_page_bid_micros) || 0;
          // const highTopOfPageBidMicros = Number(metrics?.high_top_of_page_bid_micros) || 0;
          // let cpc = 0;
          // if (lowTopOfPageBidMicros > 0 && highTopOfPageBidMicros > 0) {
          //   cpc = ((lowTopOfPageBidMicros + highTopOfPageBidMicros) / 2) / 1000000;
          // } else if (cpcMicros > 0) {
          //   cpc = cpcMicros / 1000000;
          // }
          const cpc = cpcMicros > 0 ? cpcMicros / 1000000 : 0;

          keywords.push({
            id: result.text || Math.random().toString(36).substring(7), // Google Ads API results might not have a persistent ID in this specific response
            keyword: result.text || "",
            volume: avgMonthlySearches,
            difficulty: 0, // Google Keyword Planner doesn't provide SEO difficulty
            cpc: parseFloat(cpc.toFixed(2)),
            competition: competitionLevel,
            relatedTerms: [], // Not directly provided per keyword
          });
        }
      }
      return keywords.slice(0, 50); // Limit results for now
    } catch (err: any) {
      console.error("Google Ads API Error:", JSON.stringify(err, null, 2));
      if (err.errors) {
         err.errors.forEach((error:any) => console.error(error.message));
      }
      throw new Error(`Failed to fetch keyword ideas from Google Keyword Planner: ${err.message || 'Unknown error'}`);
    }
  }
);

export async function performKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  // Split prompt into an array of keywords if it's a comma-separated string, otherwise use as a single seed.
  const seedKeywords = input.prompt.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
  if (seedKeywords.length === 0) {
    return []; // Or throw an error if seed keywords are mandatory
  }
  return keywordResearchFlow({ seedKeywordsList: seedKeywords });
}

const flowInputSchema = z.object({
  seedKeywordsList: z.array(z.string())
});

const keywordResearchFlow = ai.defineFlow(
  {
    name: 'keywordResearchFlow',
    inputSchema: flowInputSchema,
    outputSchema: KeywordResearchOutputSchema,
  },
  async (input) => {
    console.log("Calling Google Keyword Planner Tool with seeds:", input.seedKeywordsList);
    const keywords = await getGoogleKeywordIdeasTool({
      seedKeywords: input.seedKeywordsList,
      // TODO: Potentially make language and geo target configurable through flow input
    });
    
    // Ensure the output matches the schema, especially after API mapping
    return keywords.map(kw => KeywordDataSchema.parse(kw));
  }
);

