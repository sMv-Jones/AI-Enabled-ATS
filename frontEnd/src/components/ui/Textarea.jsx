import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-white/10 bg-slate-900/40 px-3 py-2 text-base text-slate-100 shadow-inner backdrop-blur-md transition-all placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }