
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Download, PlusCircle } from "lucide-react";

const invoices = [
  { id: "INV-2024-003", date: "June 15, 2024", amount: "$99.00", status: "Paid" },
  { id: "INV-2024-002", date: "May 15, 2024", amount: "$99.00", status: "Paid" },
  { id: "INV-2024-001", date: "April 15, 2024", amount: "$99.00", status: "Paid" },
];

const plans = [
  { name: "Basic", price: "$29", features: ["1 User", "100 Keyword Lookups/mo", "50 Content Generations/mo", "Basic Support"], current: false },
  { name: "Pro", price: "$99", features: ["5 Users", "500 Keyword Lookups/mo", "200 Content Generations/mo", "Priority Support", "Team Collaboration"], current: true },
  { name: "Enterprise", price: "Custom", features: ["Unlimited Users", "Unlimited Keywords", "Unlimited Content", "Dedicated Support", "Advanced Analytics"], current: false },
];


export default function BillingPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing &amp; Subscriptions</h1>
        <p className="text-muted-foreground">Manage your subscription, payment methods, and view invoices.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Current Subscription</CardTitle>
          <CardDescription>You are currently on the <span className="font-semibold text-primary">Pro Plan</span>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-secondary/30">
            <p>Your plan renews on: <span className="font-medium">July 15, 2024</span></p>
            <p>Next payment: <span className="font-medium">$99.00</span></p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Change Plan</Button>
            <Button variant="destructive">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <CreditCard className="mr-3 h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Visa **** **** **** 1234</p>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Edit</Button>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4"/> Add New Payment Method</Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Billing History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge variant={invoice.status === "Paid" ? "default" : "destructive"} className={invoice.status === "Paid" ? "bg-green-500 hover:bg-green-600" : ""}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <section className="py-8">
        <h2 className="text-2xl font-bold text-center mb-2">Subscription Plans</h2>
        <p className="text-muted-foreground text-center mb-8">Choose the plan that's right for you.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.current ? 'border-primary border-2 shadow-primary/20' : 'shadow-md'}`}>
              <CardHeader className="items-center text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-4xl font-bold text-primary">{plan.price}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.current ? "default" : "outline"} disabled={plan.current}>
                  {plan.current ? "Current Plan" : "Choose Plan"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
