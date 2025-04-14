import { cn } from "@/lib/utils";

export function FloatingActionButton({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "fixed bottom-8 bg-neutral-900 right-8 w-80 backdrop-blur rounded-lg shadow-lg z-50 max-h-[300px] ",
      className
    )}>
      <div className="max-h-[300px] overflow-y-auto p-4 [&::-webkit-scrollbar]:bg-neutral-700/50 [&::-webkit-scrollbar-thumb]:bg-neutral-700/80 [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700/90">
        {children}
      </div>
    </div>
  )
}