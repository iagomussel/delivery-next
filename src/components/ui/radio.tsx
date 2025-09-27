import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      className={cn(
        "h-4 w-4 rounded-full border border-primary text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-primary",
        className
      )}
      {...props}
    />
  )
})
Radio.displayName = "Radio"

export { Radio }

