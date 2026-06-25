import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-white/10 bg-slate-900/40 px-3 py-1 text-base text-slate-100 shadow-inner backdrop-blur-md transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }