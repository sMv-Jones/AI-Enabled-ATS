import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-wide transition-all backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900",
  {
    variants: {
      variant: {
        default: 
          "border-blue-500/30 bg-blue-950/40 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:bg-blue-900/50 hover:border-blue-400/40",
        secondary: 
          "border-slate-700/40 bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600/50",
        destructive: 
          "border-red-500/30 bg-red-950/40 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:bg-red-900/50 hover:border-red-400/40",
        outline: 
          "border-slate-600/50 bg-transparent text-slate-400 hover:bg-slate-800/20 hover:text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }