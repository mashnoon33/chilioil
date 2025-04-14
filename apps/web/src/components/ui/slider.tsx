"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, min, max, prefix, ...props }, ref) => (
    <div className="flex flex-col">
      <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    min={min}
    max={max}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-5 w-full grow overflow-hidden rounded-full bg-neutral-700">
      <SliderPrimitive.Range className="absolute h-full bg-neutral-200 " />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
  <div className="flex justify-between mt-2">
          {Array.from({ length: (max ?? 1 )- (min ?? 1 )+ 1 }).map((_, i) => (
            <div key={i} className="text-xs pl-2 text-neutral-400">{prefix}{(min ?? 1) + i}</div>
          ))}
        </div>
    </div>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
