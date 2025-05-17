
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
      customer_id: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID!,
      login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });
    
    if (!customer || !customer.keywordPlanIdeas) {
      throw new Error(
        "Failed to initialize Google Ads Customer or KeywordPlanIdeaService. " +
        "This often indicates an issue with the provided Customer IDs (LINKED_CUSTOMER_ID, LOGIN_CUSTOMER_ID), " +
        "the Refresh Token, or API access permissions for the account. " +
        "Please verify these in your .env file and Google Ads account settings, ensure the refresh token is valid, and that the user account has permissions for the target Ads account."
      );
    }
console.log("customer",customer)
    const languageId = '1000'; // English. See: https://developers.google.com/google-ads/api/reference/data/codes-formats#languages
    const geoTargetConstantId = '2840'; // United States. See: https://developers.google.com/google-ads/api/reference/data/geotargets

    try {
      const response = await customer.keywordPlanIdeas.generateKeywordIdeas({
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
      
      let finalErrorMessage = "Failed to fetch keyword ideas from Google Keyword Planner.";

      const errMessageLower = (err.message || "").toLowerCase();
      const errDetailsLower = (err.details || "").toLowerCase();

      if (errMessageLower.includes('invalid_grant') || errDetailsLower.includes('invalid_grant')) {
        finalErrorMessage = "Error: invalid_grant. Your GOOGLE_ADS_REFRESH_TOKEN is invalid, expired, or revoked. Please: " +
                            "1. Regenerate your GOOGLE_ADS_REFRESH_TOKEN using the correct OAuth2 Client ID & Secret. " +
                            "2. Ensure the Google account used for regeneration has active access to the target Google Ads account. " +
                            "3. Verify no recent password changes or security updates on the Google account have invalidated the token. " +
                            "4. Confirm the Client ID and Secret in your .env file match those used for token generation. " +
                            "5. Restart your Next.js server and Genkit development process after updating the .env file. " +
                            "Check server-side console logs for more details from the API.";
      } else if (errMessageLower.includes('unauthorized_client')) {
        finalErrorMessage = "Error: unauthorized_client. This indicates an issue with your OAuth2 credentials (Client ID, Client Secret, Refresh Token) or API permissions. Please: 1. Verify your Client ID and Client Secret in .env. 2. Regenerate your GOOGLE_ADS_REFRESH_TOKEN using the correct credentials and ensure it's for the correct Google account with Ads access. 3. Confirm the Google Ads API is enabled in your Google Cloud project, and the OAuth consent screen is correctly configured. 4. Ensure the authenticated user has authorized the application and has sufficient permissions for the Google Ads account specified by GOOGLE_ADS_LINKED_CUSTOMER_ID. 5. Check the server-side console logs for more detailed gRPC error messages from the API.";
      } else if (err.errors && err.errors[0] && err.errors[0].error_code) {
        const errorCode = err.errors[0].error_code;
        let specificError = "";
        if (errorCode.authentication_error) {
            specificError = `Authentication Error: ${errorCode.authentication_error}`;
        } else if (errorCode.authorization_error) {
            specificError = `Authorization Error: ${errorCode.authorization_error}`;
        }
        finalErrorMessage += ` Details: ${err.errors[0].message}${specificError ? ` (${specificError})` : ''}`;
         if (err.message && !finalErrorMessage.includes(err.message)) {
            finalErrorMessage += ` Original API Message: ${err.message}`;
        }
      } else if (err.message) {
        finalErrorMessage += ` Message: ${err.message}`;
      }
      
      throw new Error(finalErrorMessage);
    }
  }
);

export async function performKeywordResearch(input: KeywordResearchInput): Promise<KeywordResearchOutput> {
  const seedKeywords = input.prompt.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0);
  if (seedKeywords.length === 0) {
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

