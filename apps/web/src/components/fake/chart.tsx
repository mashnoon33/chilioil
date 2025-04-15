"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#FFFFFF"
    },
} satisfies ChartConfig

export function FakeChart() {
    const chartData = [
        { month: "January", desktop: Math.floor(Math.random() * 400) },
        { month: "February", desktop: Math.floor(Math.random() * 400) },
        { month: "March", desktop: Math.floor(Math.random() * 400) },
        { month: "April", desktop: Math.floor(Math.random() * 400) },
        { month: "May", desktop: Math.floor(Math.random() * 400) },
        { month: "June", desktop: Math.floor(Math.random() * 400) },
        { month: "July", desktop: Math.floor(Math.random() * 400) },
        { month: "August", desktop: Math.floor(Math.random() * 400) },
        { month: "September", desktop: Math.floor(Math.random() * 400) },
        { month: "October", desktop: Math.floor(Math.random() * 400) },
        { month: "November", desktop: Math.floor(Math.random() * 400) },
        { month: "December", desktop: Math.floor(Math.random() * 400) }
    ]

    return (
        <ChartContainer config={chartConfig} className="mt-3">
            <BarChart accessibilityLayer data={chartData}>
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="#FFFFFF"  />
            </BarChart>
        </ChartContainer>
    )
}
