
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import type { MonthlyClient } from "@/services/clients"

const chartConfig = {
  clients: {
    label: "New Clients",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type ClientsChartProps = {
  data: MonthlyClient[];
};

export function ClientsChart({ data }: ClientsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="total" fill="var(--color-clients)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
