
"use client";

import type { ChangeEvent } from "react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { KeywordData, SortableKeywordDataKeys, SortDirection } from "@/types";
import { ArrowDownAZ, ArrowUpAZ, Loader2, SearchIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handlePerformKeywordResearch } from "@/lib/actions";
import type { KeywordResearchInput } from "@/ai/flows/keyword-research-flow";


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
    setKeywords([]); // Clear previous results
    try {
      const input: KeywordResearchInput = { prompt };
      const results = await handlePerformKeywordResearch(input);
      setKeywords(results);
      toast({ title: "Keywords Fetched", description: `Found ${results.length} keywords related to your prompt.` });
    } catch (error) {
      console.error("Keyword research error:", error);
      toast({ title: "Error", description: (error as Error).message || "Failed to fetch keywords. Please try again.", variant: "destructive" });
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
        // Ensure values being compared are of the same type, especially for strings vs numbers
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
           return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }
        // Fallback for mixed types or other types - might need more specific handling
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
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
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
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
