
"use client"

import { Pie, PieChart, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart"
import type { TuningRequestStatusCounts } from "@/services/tuning"

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  awaiting: {
    label: "Awaiting Payment",
    color: "hsl(var(--chart-2))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

type TuningRequestsChartProps = {
  data: TuningRequestStatusCounts;
};

export function TuningRequestsChart({ data }: TuningRequestsChartProps) {
    const chartData = [
        { name: "pending", value: data.Pending, fill: "var(--color-pending)" },
        { name: "awaiting", value: data['Awaiting Payment'], fill: "var(--color-awaiting)" },
        { name: "completed", value: data.Completed, fill: "var(--color-completed)" },
    ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[350px]"
    >
      <PieChart>
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/3 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  )
}
