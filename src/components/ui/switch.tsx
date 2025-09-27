import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, disabled, id, ...props }, ref) => {
    return (
      <label className={cn("inline-flex items-center gap-2", disabled && "opacity-50")}>        
        <span className="relative inline-flex h-6 w-11 cursor-pointer items-center">
          <input
            id={id}
            ref={ref}
            type="checkbox"
            role="switch"
            className="peer sr-only"
            disabled={disabled}
            defaultChecked={defaultChecked}
            checked={checked}
            {...props}
          />
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full border border-input bg-input transition-colors peer-checked:bg-primary",
              disabled && "cursor-not-allowed"
            )}
          />
          <span
            aria-hidden
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow transition-transform peer-checked:translate-x-5"
            )}
          />
        </span>
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }

