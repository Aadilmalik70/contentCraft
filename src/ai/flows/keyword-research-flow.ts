
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
    const requiredEnvVars = [
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'GOOGLE_ADS_CLIENT_ID',
      'GOOGLE_ADS_CLIENT_SECRET',
      'GOOGLE_ADS_REFRESH_TOKEN',
      'GOOGLE_ADS_LINKED_CUSTOMER_ID',
      // GOOGLE_ADS_LOGIN_CUSTOMER_ID is used but can be undefined if not using an MCC.
      // The API client will handle errors if it's required but missing.
    ];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      throw new Error(
        `Google Ads API credentials are not fully configured in .env file. Missing or empty: ${missingVars.join(', ')}. ` +
        `Please ensure all required variables (GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_LINKED_CUSTOMER_ID) are set. ` +
        `If using a Manager Account (MCC), also ensure GOOGLE_ADS_LOGIN_CUSTOMER_ID is set. ` +
        `Remember to restart your Next.js server and Genkit development process after updating the .env file.`
      );
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

          const avgMonthlySearches = Number(metrics?.avg_monthly_searches) || 0;
          const cpcMicros = Number(metrics?.average_cpc_micros) || 0;
          const cpc = cpcMicros > 0 ? cpcMicros / 1000000 : 0;

          keywords.push({
            id: result.text || Math.random().toString(36).substring(7),
            keyword: result.text || "",
            volume: avgMonthlySearches,
            difficulty: 0, 
            cpc: parseFloat(cpc.toFixed(2)),
            competition: competitionLevel,
            relatedTerms: [],
          });
        }
      }
      return keywords.slice(0, 50);
    } catch (err: any) {
      console.error("Google Ads API Error in getGoogleKeywordIdeasTool:", JSON.stringify(err, null, 2));
      if (err.errors) {
         err.errors.forEach((error:any) => console.error(error.message));
      }
      // Construct a more informative error message
      let errorMessage = "Failed to fetch keyword ideas from Google Keyword Planner.";
      if (err.message) {
        errorMessage += ` Message: ${err.message}`;
      }
      if (err.errors && err.errors[0] && err.errors[0].message) {
         errorMessage += ` Details: ${err.errors[0].message}`;
      }
      // Check for common authentication/authorization errors by inspecting err.errors[0].error_code
      if (err.errors && err.errors[0] && err.errors[0].error_code) {
        const errorCode = err.errors[0].error_code;
        if (errorCode.authentication_error) {
            errorMessage += ` (Authentication Error: ${errorCode.authentication_error})`;
        } else if (errorCode.authorization_error) {
            errorMessage += ` (Authorization Error: ${errorCode.authorization_error})`;
        }
      }
      throw new Error(errorMessage);
    }
  }
);

export async function performKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  const seedKeywords = input.prompt.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
  if (seedKeywords.length === 0) {
    // Return empty or throw error if no valid seed keywords derived from prompt
    console.warn("No valid seed keywords extracted from prompt:", input.prompt);
    return []; 
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
    });
    
    return keywords.map(kw => KeywordDataSchema.parse(kw));
  }
);
