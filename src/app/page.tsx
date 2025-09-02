
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Clock,
  Mail,
  MessageSquareQuote,
  Send,
  ArrowRight,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart } from 'recharts';

const kpis = [
  {
    title: 'New Requests Today',
    value: '42',
    icon: Mail,
    change: '+12.5%',
  },
  {
    title: 'Follow-ups Today',
    value: '18',
    icon: MessageSquareQuote,
    change: '-5.2%',
  },
  {
    title: 'Quotes Sent Today',
    value: '25',
    icon: Send,
    change: '+8.1%',
  },
  {
    title: 'Avg. Time to Log',
    value: '1.2 hrs',
    icon: Clock,
    change: '-0.2 hrs',
  },
];

const chartData = [
  { date: '7/8', requests: 186 },
  { date: '7/9', requests: 205 },
  { date: '7/10', requests: 220 },
  { date: '7/11', requests: 180 },
  { date: '7/12', requests: 195 },
  { date: '7/13', requests: 210 },
  { date: '7/14', requests: 230 },
  { date: '7/15', requests: 215 },
  { date: '7/16', requests: 240 },
  { date: '7/17', requests: 200 },
  { date: '7/18', requests: 255 },
  { date: '7/19', requests: 260 },
  { date: '7/20', requests: 245 },
  { date: '7/21', requests: 270 },
];
const chartConfig = {
  requests: {
    label: 'Requests',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const pieChartData = [
    { name: 'New Request', value: 400, fill: 'var(--chart-1)' },
    { name: 'Follow-up', value: 300, fill: 'var(--chart-2)' },
    { name: 'Quote Sent', value: 200, fill: 'var(--chart-3)' },
];

const pieChartConfig = {
    "New Request": {
        label: "New Request",
        color: "hsl(var(--chart-1))",
    },
    "Follow-up": {
        label: "Follow-up",
        color: "hsl(var(--chart-2))",
    },
    "Quote Sent": {
        label: "Quote Sent",
        color: "hsl(var(--chart-3))",
    }
} satisfies ChartConfig;

const topCustomers = [
  { name: 'LogiTrans LLC', requests: 125, status: 'Up' },
  { name: 'QuickShip Inc.', requests: 98, status: 'Down' },
  { name: 'Global Movers', requests: 85, status: 'Up' },
  { name: 'HeavyHaul Logistics', requests: 72, status: 'Steady' },
  { name: 'CrossCountry Carriers', requests: 61, status: 'Down' },
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change} from last period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Requests by Day</CardTitle>
            <CardDescription>Last 14 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interaction Mix</CardTitle>
            <CardDescription>Breakdown of all interactions.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
             <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5} />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>By request volume this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Requests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topCustomers.map((customer) => (
                  <TableRow key={customer.name}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{customer.requests}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Jump directly into your workflows.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center gap-4 text-center">
             <h3 className="text-lg font-semibold">Ready to process some data?</h3>
             <p className="text-muted-foreground text-sm max-w-sm">
                The extraction log contains all the raw data extracted from your inbox. Review, verify, and manage your freight quotes efficiently.
             </p>
          </CardContent>
          <CardFooter>
             <Link href="/extraction-log" className="w-full">
                <Button className="w-full">
                   <span>Go to Extraction Log</span>
                   <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
             </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
