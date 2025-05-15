
"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Activity, ArrowUpRight, BarChart3, DollarSign, FileText, Lightbulb, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import Image from "next/image";

const trafficChartData = [
  { month: "Jan", organic: 1860, paid: 800, social: 500 },
  { month: "Feb", organic: 2050, paid: 900, social: 550 },
  { month: "Mar", organic: 2370, paid: 1200, social: 600 },
  { month: "Apr", organic: 1980, paid: 1100, social: 650 },
  { month: "May", organic: 2540, paid: 1300, social: 700 },
  { month: "Jun", organic: 2890, paid: 1400, social: 750 },
];

const trafficChartConfig = {
  organic: { label: "Organic", color: "hsl(var(--chart-1))" },
  paid: { label: "Paid", color: "hsl(var(--chart-2))" },
  social: { label: "Social", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const keywordDifficultyData = [
  { name: 'Easy', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Medium', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Hard', value: 300, fill: 'hsl(var(--chart-4))' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button>
          <FileText className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keywords Tracked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Keyword Difficulty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Ideas Generated</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall SEO Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <Progress value={72} aria-label="72% SEO Score" className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Monthly traffic sources for your website.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={trafficChartConfig} className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="organic" fill="var(--color-organic)" radius={4} />
                  <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                  <Bar dataKey="social" fill="var(--color-social)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Keyword Difficulty Distribution</CardTitle>
            <CardDescription>Breakdown of your tracked keywords by difficulty.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={{}} className="h-[300px] w-full max-w-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={keywordDifficultyData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                           {keywordDifficultyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                         <ChartLegend content={<ChartLegendContent nameKey="name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Keyword Opportunities</CardTitle>
          <CardDescription>Keywords with high potential for ranking.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="hidden sm:table-cell">Volume</TableHead>
                <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
                <TableHead className="text-right">Opportunity Score</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { keyword: "ai content marketing tools", volume: 12000, difficulty: 35, score: 85 },
                { keyword: "seo optimization techniques 2024", volume: 8500, difficulty: 42, score: 78 },
                { keyword: "best keyword research software", volume: 9200, difficulty: 55, score: 72 },
                { keyword: "how to write blog posts faster with ai", volume: 5400, difficulty: 28, score: 91 },
                { keyword: "content adaptation for social media", volume: 3200, difficulty: 30, score: 88 },
              ].map((item) => (
                <TableRow key={item.keyword}>
                  <TableCell>
                    <div className="font-medium">{item.keyword}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{item.volume.toLocaleString()}</TableCell>
                  <TableCell className="hidden sm:table-cell">{item.difficulty}</TableCell>
                  <TableCell className="text-right">{item.score}/100</TableCell>
                  <TableCell className="text-right">
                     <Button variant="outline" size="sm">
                        View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         <CardFooter className="justify-center border-t p-4">
            <Button size="sm" variant="ghost" className="gap-1">
              View All Keywords
            </Button>
          </CardFooter>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Recent Content Drafts</CardTitle>
          <CardDescription>Your latest AI-generated content.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "The Ultimate Guide to AI in Marketing", status: "Draft", date: "2 days ago", image: "https://placehold.co/600x400.png", hint: "marketing guide" },
            { title: "5 Ways to Boost SEO with ContentCraft AI", status: "Published", date: "5 days ago", image: "https://placehold.co/600x400.png", hint: "seo boost" },
            { title: "Adapting Your Blog for X/Twitter Threads", status: "Review", date: "1 week ago", image: "https://placehold.co/600x400.png", hint: "social media" },
          ].map((draft) => (
            <Card key={draft.title} className="overflow-hidden">
              <Image src={draft.image} alt={draft.title} width={600} height={400} className="aspect-[3/2] w-full object-cover" data-ai-hint={draft.hint} />
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{draft.title}</CardTitle>
                <CardDescription>{draft.status} - {draft.date}</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" size="sm" className="w-full">Edit Draft</Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
