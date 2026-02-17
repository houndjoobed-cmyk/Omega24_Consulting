import * as React from "react"
import { cn } from "./utils"

const Container = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-6", className)}
            {...props}
        />
    )
})
Container.displayName = "Container"

export { Container }
