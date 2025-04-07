export function FloatingActionButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-8 bg-neutral-900 right-8 w-80  backdrop-blur  p-4 rounded-lg shadow-lg z-50">
      {children}
    </div>
    )
  }