
export interface KeywordData {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number; // Typically a score from 0-100
  cpc: number; // Cost Per Click
  competition: number; // Competition score (0-1, or 0-100)
  relatedTerms: string[];
}

export type SortableKeywordDataKeys = keyof Pick<KeywordData, "keyword" | "volume" | "difficulty" | "cpc" | "competition">;

export type SortDirection = "asc" | "desc";
