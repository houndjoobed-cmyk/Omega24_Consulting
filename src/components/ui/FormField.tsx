import * as React from "react"
import { cn } from "./utils"
import { Label } from "./label"
import { Input } from "./input"

interface FormFieldProps extends React.ComponentProps<"div"> {
    label: string
    id: string
    error?: string
    inputProps?: React.ComponentProps<typeof Input>
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
    ({ className, label, id, error, inputProps, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("grid w-full items-center gap-1.5", className)} {...props}>
                <Label htmlFor={id} className={error ? "text-destructive" : ""}>
                    {label}
                </Label>
                <Input
                    id={id}
                    className={cn(
                        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50",
                        error && "border-destructive focus-visible:ring-destructive/50",
                        inputProps?.className
                    )}
                    {...inputProps}
                />
                {error && (
                    <p className="text-sm font-medium text-destructive">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
FormField.displayName = "FormField"

export { FormField }
