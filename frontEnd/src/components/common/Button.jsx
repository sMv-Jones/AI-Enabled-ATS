import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 backdrop-blur-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:bg-blue-600/30 hover:border-blue-400/50 hover:text-blue-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]",
        destructive: "bg-red-600/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:bg-red-600/30 hover:border-red-400/50 hover:text-red-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]",
        outline: "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white",
        secondary: "bg-slate-900/60 text-slate-300 border border-slate-800/60 hover:bg-slate-800/70 hover:border-slate-700/80 hover:text-slate-200",
        ghost: "text-slate-400 hover:bg-white/5 hover:text-slate-200",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export default Button;