"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

interface RangeSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  className?: string
  min: number
  max: number
  step: number
  defaultValue?: [number, number]
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  formatValue?: (value: number) => string
  prefix?: string
}

const RangeSlider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, RangeSliderProps>(
  (
    {
      className,
      min,
      max,
      step,
      prefix,
      defaultValue = [min, max],
      value,
      onValueChange,
      formatValue = (value) => value.toString(),
      ...props
    },
    ref,
  ) => {
    const [localValue, setLocalValue] = React.useState<[number, number]>(defaultValue)
    const actualValue = value !== undefined ? value : localValue

    const handleValueChange = React.useCallback(
      (newValue: number[]) => {
        const typedValue = newValue as [number, number]
        if (value === undefined) {
          setLocalValue(typedValue)
        }
        onValueChange?.(typedValue)
      },
      [onValueChange, value],
    )

    return (
      <div className={cn("space-y-4", className)}>

        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={actualValue}
          onValueChange={handleValueChange}
          className="relative flex w-full touch-none select-none items-center"
          {...props}
        >
          <SliderPrimitive.Track className="relative h-5 w-full grow overflow-hidden rounded-full bg-neutral-700">
            <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-red-600 to-green-600" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-red-500 bg-red-800 ring-offset-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
          <SliderPrimitive.Thumb className="block h-5 w-5 cursor-pointer rounded-full border-2 border-green-500 bg-green-800 ring-offset-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderPrimitive.Root>
        <div className="flex mt-2 justify-between">
          {Array.from({ length: max - min + 1 }).map((_, i) => (
            <div key={i} className="text-xs text-neutral-400">{prefix}{min + i}</div>
          ))}
        </div>

      </div>
    )
  },
)
RangeSlider.displayName = "RangeSlider"

export { RangeSlider }
