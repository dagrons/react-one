import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:shadow-[0_0_0_3px] focus-visible:shadow-sky-500/30",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-slate-950 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:via-indigo-400 hover:to-blue-500",
        destructive:
          "bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-500/90",
        outline:
          "border border-slate-700/70 bg-slate-900/70 text-slate-100 shadow-inner shadow-slate-900/60 hover:bg-slate-800/70",
        secondary:
          "bg-slate-800/80 text-slate-200 shadow-md shadow-slate-950/40 hover:bg-slate-700/80",
        ghost:
          "hover:bg-slate-800/60 hover:text-slate-100",
        link: "text-sky-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
