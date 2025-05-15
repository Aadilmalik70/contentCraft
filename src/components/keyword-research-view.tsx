
"use client";

import type { ChangeEvent } from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KeywordData, SortableKeywordDataKeys, SortDirection } from "@/types";
import { ArrowDownAZ, ArrowUpAZ, Loader2, SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockKeywordApiCall = (prompt: string): Promise<KeywordData[]> => {
  console.log("Mock API call for prompt:", prompt);
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseKeywords = [
        { id: "1", keyword: "ai content marketing", volume: 15000, difficulty: 45, cpc: 2.5, competition: 0.6, relatedTerms: ["content automation", "ai writing tools"] },
        { id: "2", keyword: "seo keyword strategy", volume: 12000, difficulty: 60, cpc: 3.1, competition: 0.8, relatedTerms: ["long-tail keywords", "topic clusters"] },
        { id: "3", keyword: "social media analytics", volume: 8000, difficulty: 30, cpc: 1.8, competition: 0.4, relatedTerms: ["engagement tracking", "influencer marketing"] },
        { id: "4", keyword: "email marketing automation", volume: 10000, difficulty: 50, cpc: 2.2, competition: 0.7, relatedTerms: ["drip campaigns", "lead nurturing"] },
        { id: "5", keyword: "contentcraft ai features", volume: 500, difficulty: 10, cpc: 0.5, competition: 0.1, relatedTerms: ["ai copilot", "marketing platform"] },
        { id: "6", keyword: "best marketing tools 2024", volume: 18000, difficulty: 70, cpc: 4.0, competition: 0.9, relatedTerms: ["crm software", "analytics platforms"] },
        { id: "7", keyword: "how to increase website traffic", volume: 22000, difficulty: 65, cpc: 2.8, competition: 0.85, relatedTerms: ["organic search", "link building"] },
      ];
      // Simulate some variation based on prompt
      const filtered = baseKeywords.filter(k => k.keyword.includes(prompt.toLowerCase().split(" ")[0] || "ai"));
      resolve(filtered.length > 0 ? filtered : baseKeywords.slice(0, Math.max(1, Math.floor(Math.random() * baseKeywords.length)) ));
    }, 1500);
  });
};


export default function KeywordResearchView() {
  const [prompt, setPrompt] = useState("");
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTerm, setFilterTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeywordDataKeys; direction: SortDirection } | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!prompt.trim()) {
      toast({ title: "Prompt required", description: "Please enter a research prompt.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setKeywords([]);
    try {
      const results = await mockKeywordApiCall(prompt);
      setKeywords(results);
      toast({ title: "Keywords Fetched", description: `Found ${results.length} keywords related to your prompt.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch keywords. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterTerm(event.target.value);
  };
  
  const requestSort = (key: SortableKeywordDataKeys) => {
    let direction: SortDirection = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredKeywords = useMemo(() => {
    let KWs = [...keywords];
    if (filterTerm) {
      KWs = KWs.filter((kw) => kw.keyword.toLowerCase().includes(filterTerm.toLowerCase()));
    }
    if (sortConfig !== null) {
      KWs.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return KWs;
  }, [keywords, filterTerm, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: SortableKeywordDataKeys }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpAZ className="h-4 w-4 ml-1 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUpAZ className="h-4 w-4 ml-1" /> : <ArrowDownAZ className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Enter your keyword research prompt (e.g., 'best AI tools for marketing')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SearchIcon className="mr-2 h-4 w-4" />}
          Search Keywords
        </Button>
      </div>

      { (keywords.length > 0 || isLoading) &&
        <Input
          type="text"
          placeholder="Filter keywords..."
          value={filterTerm}
          onChange={handleFilterChange}
          className="max-w-sm"
        />
      }

      {isLoading && keywords.length === 0 && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Fetching keywords...</p>
        </div>
      )}

      {!isLoading && keywords.length === 0 && prompt && (
         <div className="text-center py-10">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No keywords found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try a different prompt or check back later.</p>
        </div>
      )}


      {sortedAndFilteredKeywords.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => requestSort("keyword")} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">Keyword <SortIcon columnKey="keyword" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("volume")} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">Volume <SortIcon columnKey="volume" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("difficulty")} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">Difficulty <SortIcon columnKey="difficulty" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("cpc")} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">CPC <SortIcon columnKey="cpc" /></div>
                </TableHead>
                 <TableHead onClick={() => requestSort("competition")} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center">Competition <SortIcon columnKey="competition" /></div>
                </TableHead>
                <TableHead>Related Terms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredKeywords.map((kw) => (
                <TableRow key={kw.id}>
                  <TableCell className="font-medium">{kw.keyword}</TableCell>
                  <TableCell>{kw.volume.toLocaleString()}</TableCell>
                  <TableCell>{kw.difficulty}/100</TableCell>
                  <TableCell>${kw.cpc.toFixed(2)}</TableCell>
                  <TableCell>{(kw.competition * 100).toFixed(0)}%</TableCell>
                  <TableCell>{kw.relatedTerms.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
