"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Called and emailed",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Emailed",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "LVM",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "No answer",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Incorrect",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function BarGraph() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead conversion rate</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="horizontal"
            margin={{
              left: 0,
            }}
          >
            <XAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <YAxis dataKey="visitors" type="number"  />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
  )
}
