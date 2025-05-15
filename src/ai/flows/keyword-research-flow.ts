'use server';
/**
 * @fileOverview A keyword research AI agent using Google Keyword Planner.
 *
 * - performKeywordResearch - A function that handles the keyword research process.
 * - KeywordResearchInput - The input type for the performKeywordResearch function.
 * - KeywordResearchOutput - The return type for the performKeywordResearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
      customer_id: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID!, // The account to query
      login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID, // MCC ID if using one; can be undefined if not using MCC
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    // Helper function to generate a refresh token (run this manually if you don't have one)
    // You would typically run this once from a separate script.
    async function generateRefreshToken() {
      try {
        // The 'code' is the authorization code you get after the user (you) authorizes
        // the application via the authUrl.
        // This function is illustrative; consult Google Ads API Node.js client library examples
        // for a complete script to generate a refresh token.
        const authUrl = client.generateAuthUrl({
            scope: [enums.OAuthScope.ADWORDS],
            access_type: 'offline', // Important for getting a refresh token
         });
        console.log('Authorize this app by visiting this url:', authUrl);
        console.log('After authorization, you will be redirected to a URL with a `code` parameter.');
        console.log('Paste that code here to generate your refresh token.');
        // Example: const code = 'PASTE_THE_AUTHORIZATION_CODE_HERE';
        // const token = await client.fetchToken(code);
        // console.log('Your Refresh Token:', token.refresh_token);
        // Store this refresh_token securely in your .env file.
      } catch (error) {
        console.error('Error generating refresh token:', error);
        throw error;
      }
    }
    // if (!process.env.GOOGLE_ADS_REFRESH_TOKEN) {
    //   console.warn("GOOGLE_ADS_REFRESH_TOKEN is not set. You might need to run a utility to generate one.");
    //   // await generateRefreshToken(); // Do not call this directly in the flow for regular operations
    //   // return [];
    // }


    if (!customer || !customer.keywordPlanIdeaService) {
        const serviceMissingError = "Google Ads KeywordPlanIdeaService is not available. This often indicates an issue with the provided Customer IDs (LINKED_CUSTOMER_ID, LOGIN_CUSTOMER_ID) or the authentication (REFRESH_TOKEN). Ensure the IDs are correct, the refresh token is valid and has the 'adwords' scope, and the account has Keyword Planner access enabled and permitted for the API user. Also, verify your Developer Token is active and has appropriate access level.";
        console.error(serviceMissingError, {
            linkedCustomerId: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID,
            loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
            hasRefreshToken: !!process.env.GOOGLE_ADS_REFRESH_TOKEN,
        });
        throw new Error(serviceMissingError);
    }

    const languageId = '1000'; // English. See: https://developers.google.com/google-ads/api/reference/data/codes-formats#languages
    const geoTargetConstantId = '2840'; // United States. See: https://developers.google.com/google-ads/api/reference/data/geotargets

    try {
      const response = await customer.keywordPlanIdeaService.generateKeywordIdeas({
        customer_id: process.env.GOOGLE_ADS_LINKED_CUSTOMER_ID!,
        keyword_seed: { keywords: input.seedKeywords },
        language: `languageConstants/${languageId}`,
        geo_target_constants: [`geoTargetConstants/${geoTargetConstantId}`],
        keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH_AND_PARTNERS,
        // historical_metrics_options: { // To get CPC and competition, historical metrics are needed.
        //   year_month_range: { // Define a range for historical data if needed
        //     start: { year: new Date().getFullYear() -1 , month: enums.MonthOfYear.JANUARY },
        //     end: { year: new Date().getFullYear(), month: enums.MonthOfYear.DECEMBER }
        //   }
        // }
      });

      const keywords: KeywordData[] = [];
      if (response.results) {
        for (const result of response.results) {
          const metrics = result.keyword_idea_metrics;
          let competitionLevel = 0;
          // Competition index is not directly 'low, medium, high' for competition level in the same way as avg_monthly_searches might have.
          // metrics.competition is an enum KeywordPlanCompetitionLevel
          // We'll map it to a numeric value.
          if (metrics?.competition === enums.KeywordPlanCompetitionLevel.LOW) {
            competitionLevel = 0.25;
          } else if (metrics?.competition === enums.KeywordPlanCompetitionLevel.MEDIUM) {
            competitionLevel = 0.5;
          } else if (metrics?.competition === enums.KeywordPlanCompetitionLevel.HIGH) {
            competitionLevel = 0.75;
          } else if (metrics?.competition_index) { // competition_index is a number from 0 to 100
             competitionLevel = Number(metrics.competition_index) / 100;
          }


          const avgMonthlySearches = Number(metrics?.avg_monthly_searches) || 0;
          // CPC can be found in different fields depending on what you request (low/high page CPT)
          // For this example, we'll use average_cpc_micros if available
          const cpcMicros = Number(metrics?.average_cpc_micros) || 0;
          const cpc = cpcMicros > 0 ? cpcMicros / 1000000 : 0;


          keywords.push({
            id: result.text || Math.random().toString(36).substring(7), // Use text as ID or generate one
            keyword: result.text || "",
            volume: avgMonthlySearches,
            difficulty: 0, // Keyword Planner doesn't directly provide SEO difficulty
            cpc: parseFloat(cpc.toFixed(2)),
            competition: parseFloat(competitionLevel.toFixed(2)), // Ensure this is a number 0-1
            relatedTerms: [], // Keyword Planner provides related ideas, not per-keyword related terms in this call
          });
        }
      }
      return keywords.slice(0, 50); // Limit to 50 results for now
    } catch (err: any) {
      console.error("Google Ads API Error in getGoogleKeywordIdeasTool:", JSON.stringify(err, null, 2));
      if (err.errors) {
        err.errors.forEach((error: any) => console.error(error.message, error.error_code));
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
          errorMessage += ` (Authentication Error: ${errorCode.authentication_error}). Please verify your OAuth2 credentials (Client ID, Client Secret, Refresh Token) and Developer Token. Ensure the Refresh Token is valid and has the 'adwords' scope.`;
        } else if (errorCode.authorization_error) {
          errorMessage += ` (Authorization Error: ${errorCode.authorization_error}). Ensure the authenticated user has sufficient permissions for the specified Ads account (LINKED_CUSTOMER_ID) and that the Developer Token has appropriate access.`;
        } else if (errorCode.header_error) {
           errorMessage += ` (Header Error: ${errorCode.header_error}). This might be related to an invalid Developer Token or incorrect Customer ID in the request headers.`;
        } else if (errorCode.internal_error) {
           errorMessage += ` (Internal Google Ads API Error: ${errorCode.internal_error}). Please try again later.`;
        } else if (errorCode.quota_error) {
           errorMessage += ` (Quota Error: ${errorCode.quota_error}). You may have exceeded your API usage limits.`;
        } else if (errorCode.request_error) {
            errorMessage += ` (Request Error: ${errorCode.request_error}). Check the request parameters. The seed keywords might be invalid or too broad.`;
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
    inputSchema: flowInputSchema, // Use the refined schema
    outputSchema: KeywordResearchOutputSchema,
  },
  async (input) => {
    // The input to the flow is now { seedKeywordsList: string[] }
    console.log("Calling Google Keyword Planner Tool with seeds:", input.seedKeywordsList);
    const keywords = await getGoogleKeywordIdeasTool({
      seedKeywords: input.seedKeywordsList,
      // languageId and geoTargetConstantId can be passed if needed, or defaults used
    });

    // Ensure each keyword object conforms to KeywordDataSchema
    return keywords.map(kw => KeywordDataSchema.parse(kw));
  }
);
